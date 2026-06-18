import Notification from "../models/notification.model.js";

export const getNotifications = async(req,res)=>{
    try {
        const notifications = await Notification.find({user:req.userId,})
        .sort({createdAt:-1})
        .limit(50);
        return res.status(200).json({notifications});

    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}
export const markNotificationRead = async(req,res)=>{
    try {
        const notification = await Notification.findOne({_id:req.params.id,
            user:req.userId,
        });
        if(!notification){
            return res.status(404).json({message:"Notification not found"});
        }
        notification.isRead = true;
        await notification.save();
        return res.status(200).json({notification});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}
export const markAllNotificationRead = async(req,res)=>{
    try {
       await Notification.updateMany({user:req.userId},
        {isRead : true}
       ) ;
       return res.status(200).json({message:"All notifications marked as read"});
    } catch (error) {
          return res.status(500).json({message:error.message});
    }
}