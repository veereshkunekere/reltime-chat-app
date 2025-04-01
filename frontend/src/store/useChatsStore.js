import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import {toast} from 'react-hot-toast';
import { io } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    isMessagesLoading:false,
    isUsersLoading:false,
    selectedUser:null,

    getUser:async (userId)=>{
        set({isUsersLoading:true})
       try {
          const response=await axiosInstance.get("/message/users",userId);
          set({users:response.data})
       } catch (error) {
          toast.error(error.response?.data?.messages);
       }
       finally{
          set({isUsersLoading:false})
       }
    },
    getMessages:async (userId)=>{
        set({isMessagesLoading:true});
        try {
            const res=await axiosInstance.get(`/message/${userId}`);
            set({messages:res.data});
        } catch (error) {
            toast.error(error.data?.response?.messages);
        } finally{
            set({isMessagesLoading:false})
        }    
    },
    sendMessage:async (messageData)=>{
        console.log(messageData);
        const {selectedUser,messages}=get();
        try {
            const res=await axiosInstance.post(`/message/send/${selectedUser._id}`,messageData);
            console.log(res);
            set({messages:[...messages,res.data]})
        } catch (error) {
            toast.error(error.response?.data?.message)
        }

    },
    subscribeToMessage:async()=>{
        const {selectedUser}=get();
        const socket=useAuthStore.getState().socket;
        socket.on("newMessage",(data)=>{
            if(data.senderId!==selectedUser._id) return;
            set({messages:[...get().messages,data]})
        })
    },
    unsubscribeToMessage:()=>{
        const socket=useAuthStore.getState().socket;
        socket.off("newMessage")
    },
    setSelectedUser:(selectedUser)=>set({selectedUser})
}))