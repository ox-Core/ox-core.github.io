async function getMarkdownFiles() {
    const res = await fetch('docs/');
    const text = await res.text();
    const regex = /href="([^"]+\.md)"/g;
    let match;
    const files = [];
    while ((match = regex.exec(text)) !== null) {
        files.push(match[1]);
    }
    return files;
}
function filenameToTitle(filename) {
    let name = filename.replace(/^.*[\\\/]/, '');
    name = name.replace(/\.[^/.]+$/, '');
    name = name.replace(/^docs\./i, '');
    name = name.replace(/([a-z])([A-Z])/g, '$1 $2');
    name = name.replace(/[-_]/g, ' ');
    name = name.replace(/\b\w/g, c => c.toUpperCase());
    return name.trim();
}
async function loadAndRenderDoc(mdFile) {
    const res = await fetch(mdFile);
    const md = await res.text();
    const mdParser = window.markdownit({
        html: true,
        linkify: true,
        typographer: true,
        highlight: function (str, lang) {
            if (lang && window.hljs.getLanguage(lang)) {
                try {
                    return '<pre class="hljs"><code>' + window.hljs.highlight(str, { language: lang, ignoreIllegals: true }).value + '</code></pre>';
                } catch (__) {}
            }
            return '<pre class="hljs"><code>' + window.markdownit().utils.escapeHtml(str) + '</code></pre>';
        }
    });
    if (window.markdownitSub) {
        mdParser.use(window.markdownitSub);
    }
    if (window.markdownitSup) {
        mdParser.use(window.markdownitSup);
    }
    if (window.markdownitContainer) {
        mdParser.use(window.markdownitContainer, 'info');
        mdParser.use(window.markdownitContainer, 'warning');
        mdParser.use(window.markdownitContainer, 'success');
        mdParser.use(window.markdownitContainer, 'danger');
    }
    const html = mdParser.render(md);
    document.getElementById('doc-content').innerHTML = html;
    if (window.hljs && window.hljs.highlightAll) {
        window.hljs.highlightAll();
    }
}
function setActive(idx) {
    document.querySelectorAll('.docs-list-item').forEach((el, i) => {
        el.classList.toggle('active', i === idx);
    });
}
document.addEventListener('DOMContentLoaded', async () => {
    // Hamburger menu for docs sidebar on mobile
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.onclick = function() {
            document.body.classList.toggle('sidebar-open');
        };
    }
    const res = await fetch('docs/docs-manifest.json');
    const manifest = await res.json();
    const list = document.getElementById('docs-list');
    list.innerHTML = '';
    function fileToHash(file) {
        return file.replace(/\.md$/, '').toLowerCase();
    }
    function hashToIndex(hash) {
        const clean = hash.replace(/^#/, '');
        return manifest.findIndex(doc => fileToHash(doc.file) === clean);
    }
    manifest.forEach((doc, idx) => {
        const li = document.createElement('li');
        li.className = 'docs-list-item';
        li.dataset.md = 'docs/' + doc.file;
        li.tabIndex = 0;
        li.textContent = doc.label;
        li.onclick = () => {
            window.location.hash = fileToHash(doc.file);
            loadAndRenderDoc('docs/' + doc.file);
            setActive(idx);
            document.body.classList.remove('sidebar-open');
        };
        li.onkeydown = e => {
            if (e.key === 'Enter' || e.key === ' ') {
                window.location.hash = fileToHash(doc.file);
                loadAndRenderDoc('docs/' + doc.file);
                setActive(idx);
                document.body.classList.remove('sidebar-open');
            }
        };
        list.appendChild(li);
    });
    function loadFromHash() {
        const hash = window.location.hash;
        let idx = hashToIndex(hash);
        if (idx === -1) idx = 0;
        loadAndRenderDoc('docs/' + manifest[idx].file);
        setActive(idx);
    }
    window.addEventListener('hashchange', loadFromHash);
    loadFromHash();
    document.querySelector('.sidebar-toggle').onclick = function() {
        document.body.classList.toggle('sidebar-open');
    };
});
