# VirtualContainer - A SerenityJS API

VirtualContainer is an API for BDSX that allows you to create fake interactive container menus !

---

## Features

- Multiple containers support

- Item transactions detection

- container close detection

- possibility to dynamically change items

- easy to use API

#### Available container types

- [x] Chest

...and more to come !

#### Soon to be added

- custom container name !

- More container types

## Installation
clone the `VirtualContainer.ts` into your own plugins `src` directory
## Usage examples

You can simply create and display a fake chest this way :

```ts
const container = VirtualContainer.create(player, FakeContainerType.Chest);
container.sendToPlayer();
```

*everything else is handled automatically !*

You can add/delete items to the container this way :

```ts
// Sets the item in slot 0
container.setItem(0, new Item(ItemTypes.resolve("minecraft:diamond"), 64));
// Adds the item to the first empty slot
container.addItem(new Item(ItemTypes.resolve("minecraft:diamond"), 64));
// Set multiple items at once
container.setContents({
            5: new Item(ItemTypes.resolve("minecraft:gold_ingot"), 1),
            7: new Item(ItemTypes.resolve("minecraft:iron_ingot"), 1),
            9: new Item(ItemTypes.resolve("minecraft:emerald"), 1),
        });
// Clears the item in slot 5
container.clearItem(5);
// Clears all items
container.clearContents();
```

<!--
Other features :
```ts
// Set a custom name to the container
// (must be called before sending the container)
container.setCustomName("BDSX is awesome !");
// Closes the container client-side, and destructs it.
container.closeContainer();
```
-->

Using callbacks :

```ts
container.onTransaction((action) => {
    // Do something here...
});

container.onContainerClose(() => {
    // Do something here...
});
```

returning `CANCEL` for item transactions does not change anything for now. In the future, Items will be able to be placed and taken unless `CANCEL` is returned.*

##### Simple examples

Sends a message when a diamond is clicked :

```ts
const container = VirtualContainer.create(actor, FakeContainerType.Chest);
        container.addItem(new Item(ItemTypes.resolve("minecraft:iron_ingot"), 1));
        container.addItem(new Item(ItemTypes.resolve("minecraft:gold_ingot"), 1));
        container.addItem(new Item(ItemTypes.resolve("minecraft:diamond"), 1));
        container.sendToPlayer();
        container.onTransaction((action) => {
            if(action.type === ItemStackRequestActionType.Take && container.getItem(action.getSrc().slot)?.getName() === "minecraft:diamond") {
                container.closeContainer();
                actor.sendMessage("You have clicked the diamond!");
            }
        });
```

Sends a message when the player closes the container:

```ts
const container = VirtualContainer.create(actor, FakeContainerType.Chest);
        container.sendToPlayer();
        container.onContainerClose(() => {
            actor.sendMessage("Container closed !");
        });
```

## Credits

API base by [@Nathan93705](https://github.com/Nathan93705)
