export const maxId = (items) => {
    const Max = (items.length > 0) ? Math.max(...items.map(item=>item.id)) : 0
    return Max + 1
}

modules.export = maxId;
