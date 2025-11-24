import React, {useState, useEffect, useRef} from 'react'
import client,{ databases, DATABASE_ID, COLLECTION_ID_MESSAGES ,storage, BUCKET_ID } from '../appwriteConfig'

import { ID, Query, Role, Permission } from 'appwrite'
import { Trash2 } from 'react-feather'
import Header from '../components/Header'
import { useAuth } from '../utils/AuthContext'
import { GrGallery } from "react-icons/gr";

import EmojiPicker from "emoji-picker-react";
import { FaSmile } from "react-icons/fa";


const Room = () => {

    const {user} = useAuth()
    const [messages, setMessages] = useState([])
    const [messageBody, setMessageBody]= useState('')
  
    const messageEndRf = React.useRef(null)
    const isAtBottomRef = useRef(true)
    const [ selectedFile,setSelectedFile] = useState(null)

const [showEmojiPicker, setShowEmojiPicker] = useState(false);


         { messages.videoUrl ? (
  <video controls className='chat-video'>
    <source src={messages.videoUrl} type='video/mp4'/>

        </video>
      ):<span>{messages.body}</span>
    }
    
  useEffect(() =>{
    if (isAtBottomRef.current){
      setTimeout(()=>messageEndRf.current?.scrollIntoView({behavior: 'smooth'}),50)
    }


    const box = document.getElementById("messagesBox")

    const handleScroll = () => {
      const atBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 50 
      isAtBottomRef.current = atBottom
    }
    box.addEventListener("scroll", handleScroll)

    
    getMessages()

     const unsubscribe =  client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`, response =>{
      
       if (response.events.includes("databases.*.collections.*.documents.*.create")) {
            // console.log("A MESSAGE WAS CREATED"); 
             setMessages(prevState=>[...prevState, response.payload ])
     }
      if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
            // console.log("A MESSAGE WAS Deleted"); 
            setMessages(prevState => prevState.filter(message => message.$id !== response.payload.$id))
     }
    
    
  });
  return () =>{
    unsubscribe()
    box.removeEventListener("scroll", handleScroll)
  }

},[]) 

useEffect(()=>{
  if (isAtBottomRef.current){
    setTimeout(() =>{
      messageEndRf.current?.scrollIntoView({behavior: "smooth"});

    },50)
  }
})

// Send message
const handleSubmit = async (e) =>{
  e.preventDefault();
    setShowEmojiPicker(false); 

try{
  let fileUrl = null;
  let fileType = null;

  if (selectedFile) {
    const uploadedFile = await storage.createFile(
      BUCKET_ID,
      ID.unique(),
      selectedFile,
    );
     
    fileUrl = storage.getFileView(BUCKET_ID,uploadedFile.$id);
    fileType = selectedFile.type;
  }
 const payload = {
  user_id: user.$id,
  username: user.name,
  body: messageBody,
  fileUrl: fileUrl,
  fileType: fileType
 }

  await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      ID.unique(),
      payload,
      [Permission.write(Role.user(user.$id))]
    );

    setMessageBody("");
    setSelectedFile(null);
  } catch (error) {
    console.error("Error uploading file or creating message:", error);
  }
}

  const getMessages = async () =>{
    const response =await databases.listDocuments(
      DATABASE_ID,
       COLLECTION_ID_MESSAGES,
       [
    Query.orderAsc('$createdAt'),
    Query.limit(100)
  ]
      )
    // console.log( response.documents);
    setMessages(response.documents)
    
  }

 //delete Message
  const deleteMessage = async (message_id) => {
         databases.deleteDocument(
            DATABASE_ID, COLLECTION_ID_MESSAGES, message_id
         )
        }

  return(
   <div className='container'>
  
        <Header/>
        <div  className='room--container'>         
      <div id='messagesBox' className='messages-list'>
       
        {messages.map(message =>(

          
              <div
               className={`message--wrapper ${message.user_id === user.$id ? 'own-message':''}`}
                key={message.$id}
              
                >
                 <div 
                className={`message--body ${message.fileUrl ? "media-message" : ""} ${message.user_id === user.$id ? "own-message--body":""}`}>


                {message.fileUrl ? (
  message.fileType?.startsWith("video/") ? (
    //video
    <video controls width="250">
      <source src={message.fileUrl} type={message.fileType}/>
    </video>

     ) : message.fileType?.startsWith("audio/") ? (
    <audio controls style={{width: "250px"}}>
      <source src={message.fileUrl} type={message.fileType}/>
    </audio>
     ):(
    <img src={message.fileUrl} width="250" alt="uploaded"/>
   )
   ) : (
     <span>{message.body}</span>
   )}

                </div>
                <div className='message--header'>
                  <p >
                     {message?.username ?(
                      <span>{message.username}</span>
                     ):(
                      <span>Anoymous user</span>
                     )}
                      <small className='message-timestamp '>{new Date(message.$createdAt).toLocaleTimeString()}</small>
                  </p>
                  { message.$permissions.includes(`delete(\"user:${user.$id}\")`) && (
                      <Trash2  
                      className='delete--btn' onClick={()=>{deleteMessage(message.$id)}}/>
                  )}
                 
                    
                 
                </div>

            </div>
               ))}
              
             <div ref={messageEndRf}></div>
             </div>


                 <form onSubmit={handleSubmit} className='message--form'>
                <div>
                  <div className="emoji-wrapper"  style={{ position: "relative" }}>
    <FaSmile
        size={25}
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        style={{ cursor: "pointer", marginRight: "10px" }}
      
    />

    {showEmojiPicker && (
        <div style={{ position: "absolute", bottom: "20px", right: "80px" }}>
            <EmojiPicker
                onEmojiClick={(emojiObj) => {
                    setMessageBody(prev => prev + emojiObj.emoji);
                    setShowEmojiPicker(true)
                }}
            />
        </div>
       
    )}
</div>

                   

  <textarea
  className="text-message"
  required={!selectedFile}
  placeholder="Say something..."
  onChange={(e) => {
    setMessageBody(e.target.value);
    e.target.style.height = "auto";        // reset height
    e.target.style.height = e.target.scrollHeight + "px"; // auto expand
  }}
  value={messageBody}
  rows={1}
/>
                </div>
                
                    <input 
                    id='fileInput'
                     type="file"
                accept='video/*,image/*,audio/*'
                onChange={(e)=> setSelectedFile(e.target.files[0])}
                style={{display:"none"}}
               />
               <label htmlFor="fileInput" className='file-icon'>
                <GrGallery size={25}/>
               </label>
               {selectedFile && (
                <div className='file-preview'>
                  <p>📎 {selectedFile.name}</p>

                </div>
               )}
              
                <div className='send-btn--wrapper' >
                    <input  className='btn btn--secondary' type="submit"  value='Send'/>
                   
                </div>

                </form>
                
      </div>
       
    </div>
    
  
  )
    
  }
    

export default Room