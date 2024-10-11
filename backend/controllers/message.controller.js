import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { populate } from "dotenv";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        })

        if(!conversation){
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        });

        if(newMessage){
            conversation.messages.push(newMessage._id);
        }

        // await newMessage.save();
        // await conversation.save();

        //run parallel
        await Promise.all([conversation.save(), newMessage.save()])

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json({ msg: "Message Sent Successfully"});
    } catch (error) {
        console.log("Error in sendMesssage", error.message);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

export const getMessage = async (req, res) => {
    try {
        const userToChatId = new mongoose.Types.ObjectId(req.params.id.toString());
        const senderId = req.user._id;

        const getConversation = await Conversation.findOne({
            participants: { $all: [ senderId, userToChatId ] }
        }).populate("messages");

        if(!getConversation){
            return res.status(404).json({error: "Conversation Not Found"});
        }

        const messages = getConversation.messages;

        return res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMesssage", error.message);
        return res.status(500).json({error: "Internal Server Error"});
    }
}