// const saveCardOrder = async (order: string[]) => {
//   try {
//     await axios.post('/api/user/card-order', { order });
//     console.log('Card order saved successfully');
//   } catch (error) {
//     console.error('Failed to save card order', error);
//   }
// };

// const handleDragEnd = (result: DropResult) => {
//   if (!result.destination) {
//     return;
//   }

//   const reorderedItems = Array.from(cardOrder);
//   const [movedItem] = reorderedItems.splice(result.source.index, 1);
//   reorderedItems.splice(result.destination.index, 0, movedItem);

//   setCardOrder(reorderedItems);
//   saveCardOrder(reorderedItems); // Save the new order
// };
