const {displayItems,displayItemByName, getItemByName} = require('../config/dbConnect')

const DisplayAllItems = async (req, res) => {
 try{
    const DisplayedItems = await displayItems();
    res.status(200).json(DisplayedItems);
 } catch(err){
    console.error(err.message);
    return res.status(500).json({ error: 'Server error' });
 }
 
}

const DisplaySpecificItem = async (req, res) => {
    const {name} = req.query;
    try{
        const DisplayedItems = await getItemByName(name);
        // console.log(`DisplayedItem: ${DisplayedItem}`);
       return res.status(200).json(DisplayedItems);
    }catch(err){
        console.error(err.message);
        return res.status(500).json({error: "Server error"});
    }
}
module.exports = {DisplayAllItems, DisplaySpecificItem};