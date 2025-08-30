## Class: `acheron::ecs::World`

Central class of the ECS framework.
Manages entities, components, systems, and singletons.

---

### Entity Management

```cpp
Entity Spawn()
```

* **Returns:** A new entity.

```cpp
void Despawn(Entity entity)
```

* **Parameters:**

  * `entity` — The entity to destroy.
* **Effects:** Removes the entity and all its components.

---

### Component Management

```cpp
template<typename T> void RegisterComponent()
```

* Registers a component type `T`.

```cpp
template<typename T> void AddComponent(Entity entity, T component = {})
```

* **Parameters:**

  * `entity` — Target entity.
  * `component` — Component instance (default constructor if omitted).
* **Effects:** Adds a component `T` to `entity`.

```cpp
template<typename T> void RemoveComponent(Entity entity)
```

* **Parameters:**

  * `entity` — Target entity.
* **Effects:** Removes component `T` from `entity`.

```cpp
template<typename T> T& GetComponent(Entity entity)
```

* **Parameters:**

  * `entity` — Target entity.
* **Returns:** Reference to component `T` on `entity`.

```cpp
template<typename T> ComponentID GetComponentID()
```

* **Returns:** Internal ID for component type `T`.

```cpp
template<typename... Components> Signature MakeSignature()
```

* **Returns:** A component signature built from the given types.

---

### System Management

```cpp
template<typename T> std::shared_ptr<T> RegisterSystem(
    Signature signature = {},
    SystemStage stage = SystemStage::Update
)
```

* Registers a system class `T`.

```cpp
template<typename Func> std::shared_ptr<System> RegisterSystemExplicit(
    Func&& func,
    Signature signature = {},
    SystemStage stage = SystemStage::Update
)
```

* Registers a system directly from a callable.

```cpp
template<typename... Components, typename Func> std::shared_ptr<System> RegisterSystem(
    Func&& func,
    SystemStage stage = SystemStage::Update
)
```

* Registers a system operating on specific components with a function.

```cpp
template<typename T> void SetSystemSignature(Signature signature)
```

* **Parameters:**

  * `signature` — Component signature for system `T`.

---

### Singleton Management

```cpp
template<typename T> void SetSingleton(T value)
```

* **Parameters:**

  * `value` — Singleton instance to store.

```cpp
template<typename T> T& GetSingleton()
```

* **Returns:** Reference to the stored singleton of type `T`.

---

### Module Import

```cpp
template<typename T> void Import()
```

* Imports a module `T` (must inherit from `Module`).

---

### Execution

```cpp
void Update(double dt = 0.0)
```

* **Parameters:**

  * `dt` — Time step for this update pass.
* **Effects:** Runs all registered systems for one frame.
