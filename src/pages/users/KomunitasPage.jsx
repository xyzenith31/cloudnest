import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import twemoji from 'twemoji'; // <-- [BARU] Impor library Twemoji
import { 
    FiSearch, FiMessageSquare, FiPlus, FiSend, FiSmile, FiPaperclip, FiMoreVertical, 
    FiPhone, FiVideo, FiUserPlus, FiUsers, FiRadio, FiBookmark, FiSettings, 
    FiArchive, FiBellOff, FiUser, FiThumbsUp, FiImage, FiFileText, FiLink, FiChevronDown
} from 'react-icons/fi';

import EmojiPicker from '../../components/EmojiPicker'; 
import ChatActionMenu from '../../components/ChatActionMenu';
import MessageActionMenu from '../../components/MessageActionMenu';
import ProfileCardModal from '../../components/ProfileCardModal';
import AttachmentMenu from '../../components/AttachmentMenu';

// --- FUNGSI & DATA DUMMY (Tidak Berubah) ---
const getInitials = (name) => { if (!name || typeof name !== 'string') return '?'; const nameParts = name.trim().split(' ').filter(Boolean); if (nameParts.length === 0) return '?'; if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase(); const firstInitial = nameParts[0][0]; const lastInitial = nameParts[nameParts.length - 1][0]; return `${firstInitial}${lastInitial}`.toUpperCase(); };
const dummyContacts = [ { id: 1, name: 'Alya Putri', avatar: 'https://i.pravatar.cc/150?u=alya', online: true, lastMessage: 'Siap, nanti aku kabari lagi ya!', timestamp: '10:45', unread: 2, color: 'bg-blue-500' }, { id: 2, name: 'Tim Desain Grafis', isGroup: true, lastMessage: 'Budi: Revisi logo sudah selesai.', timestamp: '09:15', unread: 0, color: 'bg-indigo-500', members: 5, description: 'Grup untuk koordinasi semua proyek desain.' }, { id: 3, name: 'Budi Santoso', online: false, lastMessage: 'Terima kasih atas bantuannya!', timestamp: 'Kemarin', unread: 0, color: 'bg-green-500' }, { id: 4, name: 'Citra Lestari', avatar: 'https://i.pravatar.cc/150?u=citra', online: true, lastMessage: 'Oke, aku tunggu.', timestamp: 'Kemarin', unread: 1, color: 'bg-pink-500' }, { id: 5, name: 'Rapat Proyek Internal', isGroup: true, lastMessage: 'Anda: Jangan lupa meeting jam 2 siang.', timestamp: '2 hari lalu', unread: 0, color: 'bg-purple-500', members: 8, description: 'Koordinasi mingguan untuk proyek A.' }, { id: 6, name: 'David Maulana', online: false, lastMessage: 'Proposal sudah saya kirim.', timestamp: '2 hari lalu', unread: 0, color: 'bg-red-500'}, { id: 7, name: 'Komunitas Fotografi', isGroup: true, lastMessage: 'Eka: Hunting foto weekend ini?', timestamp: '3 hari lalu', unread: 5, color: 'bg-yellow-500', members: 23, description: 'Berbagi tips & jadwal fotografi.'}, { id: 8, name: 'Project Manager', online: true, lastMessage: 'Tolong update progress hari ini.', timestamp: 'Baru Saja', unread: 1, color: 'bg-gray-500'}, { id: 9, name: 'HR Department', isGroup: true, lastMessage: 'Pengumuman: Libur nasional...', timestamp: '08:00', unread: 0, color: 'bg-cyan-500', members: 3, description: 'Informasi resmi dari HR.' },];
const dummyMessages = { 1: [ { id: 'date-1', type: 'date', text: 'Hari Ini' }, { id: 'a', text: 'Halo Alya, apa kabar?', sender: 'me', timestamp: '10:42' }, { id: 'b', text: 'Baik! Kamu gimana?', sender: 'other', timestamp: '10:43' }, { id: 'c', text: 'Aku juga baik. Nanti jadi kan kita diskusi proyek?', sender: 'me', timestamp: '10:44' }, { id: 'd', text: 'Siap, nanti aku kabari lagi ya!', sender: 'other', timestamp: '10:45' } ], 2: [ { id: 'date-2', type: 'date', text: 'Kemarin' }, { id: 'f', text: 'Budi: Revisi logo sudah selesai, bisa dicek di folder "Revisi Final".', sender: 'other', timestamp: '09:15' } ], };

// --- VARIAN ANIMASI ---
const listContainerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
const listItemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } } };
const messageBubbleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 500, damping: 30 } }
};


// --- KOMPONEN-KOMPONEN UI ---
const Avatar = ({ contact, size = 'md' }) => { const sizeClasses = { md: 'w-12 h-12 text-base', lg: 'w-16 h-16 text-xl' }; return (<div className={`relative flex-shrink-0 ${sizeClasses[size]}`}>{contact.avatar ? <img src={contact.avatar} alt={contact.name} className="w-full h-full rounded-full object-cover avatar-image" /> : <div className={`w-full h-full rounded-full flex items-center justify-center font-bold text-white ${contact.color}`}><span>{getInitials(contact.name)}</span></div>}{contact.online && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white"></div>}</div>);};
const MenuItem = ({ icon: Icon, text, onClick }) => (<button onClick={onClick} className="w-full flex items-center gap-4 px-4 py-2.5 text-left text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"><Icon size={20} className="text-gray-500" /><span className="font-semibold">{text}</span></button>);
const ChatListItem = ({ chat, active, onClick, onContextMenu, onAvatarClick }) => { const longPressTimer = useRef(); const clearLongPressTimer = () => clearTimeout(longPressTimer.current); const handleInteractionStart = (e) => { e.preventDefault(); longPressTimer.current = setTimeout(() => { const event = e.touches ? e.touches[0] : e; onContextMenu(event, chat); }, 500); }; return ( <motion.div variants={listItemVariants} layout onClick={() => onClick(chat)} onContextMenu={(e) => { e.preventDefault(); onContextMenu(e, chat); }} onMouseDown={handleInteractionStart} onMouseUp={clearLongPressTimer} onMouseLeave={clearLongPressTimer} onTouchStart={handleInteractionStart} onTouchEnd={clearLongPressTimer} className={`flex items-center p-3 cursor-pointer rounded-xl transition-all duration-300 relative select-none chat-list-item ${active ? 'bg-white shadow-md' : 'hover:bg-gray-100'}`} > {active && <motion.div layoutId="activeChatBubble" className="absolute inset-0 bg-blue-500 rounded-xl z-0"></motion.div>} <div className="relative z-10 flex items-center w-full"> <div onClick={(e) => onAvatarClick(e, chat)} className="relative z-20 cursor-pointer" > <Avatar contact={chat} /> </div> <div className="flex-1 overflow-hidden ml-4"> <div className="flex justify-between items-center"> <p className={`font-bold truncate ${active ? 'text-white' : 'text-gray-800'}`}>{chat.name}</p> <span className={`text-xs flex-shrink-0 ${active ? 'text-blue-200' : 'text-gray-400'}`}>{chat.timestamp}</span> </div> <div className="flex justify-between items-start mt-1"> <p className={`text-sm truncate ${active ? 'text-blue-100' : 'text-gray-500'}`}>{chat.lastMessage}</p> {chat.unread > 0 && (<motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{chat.unread}</motion.span>)} </div> </div> </div> </motion.div> ); };

// [MODIFIKASI] Komponen MessageBubble kini menggunakan Twemoji untuk merender teks
const MessageBubble = ({ msg, onContextMenu }) => {
    const isMe = msg.sender === 'me';
    const longPressTimer = useRef();
    const handleMouseDown = (e) => { if (e.button === 0) { longPressTimer.current = setTimeout(() => { onContextMenu(e, msg.id); }, 500); } };
    const handleMouseUp = () => clearTimeout(longPressTimer.current);
    const handleTouchStart = (e) => { longPressTimer.current = setTimeout(() => { onContextMenu(e.touches[0], msg.id); }, 500); };
    const handleTouchEnd = () => clearTimeout(longPressTimer.current);

    // Fungsi untuk mem-parse teks menjadi HTML dengan gambar emoji
    const parsedText = { __html: twemoji.parse(msg.text) };

    return (
        <motion.div variants={messageBubbleVariants} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`} >
            <motion.div layout className={`flex items-end gap-2 group max-w-xl message-bubble-wrapper ${isMe ? 'flex-row-reverse message-bubble-me' : 'message-bubble-other'}`} onContextMenu={(e) => onContextMenu(e, msg.id)} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} >
                <div className={`p-3 px-4 rounded-t-2xl cursor-pointer ${ isMe ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-l-2xl' : 'bg-white text-gray-800 rounded-r-2xl shadow-sm' }`} >
                    {/* Menggunakan dangerouslySetInnerHTML untuk merender HTML dari Twemoji */}
                    <p className="text-base" dangerouslySetInnerHTML={parsedText}></p>
                    <span className={`text-xs mt-1 block text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}> {msg.timestamp} </span>
                </div>
                <motion.div className={`message-actions flex items-center gap-1 bg-white p-1 rounded-full shadow-md ${isMe ? 'mr-2' : 'ml-2'}`}>
                    <button className="p-1.5 rounded-full hover:bg-gray-200"><FiThumbsUp size={16}/></button>
                    <button className="p-1.5 rounded-full hover:bg-gray-200"><FiSmile size={16}/></button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

const TypingIndicator = () => (<motion.div variants={listItemVariants} className="flex items-end gap-2"><div className="max-w-md p-3 px-4 rounded-t-2xl bg-white text-gray-800 rounded-r-2xl shadow-sm flex items-center gap-1.5"><motion.span animate={{y: [0, -4, 0]}} transition={{duration: 0.8, repeat: Infinity}} className="w-2 h-2 bg-gray-300 rounded-full"/><motion.span animate={{y: [0, -4, 0]}} transition={{duration: 0.8, repeat: Infinity, delay: 0.2}} className="w-2 h-2 bg-gray-300 rounded-full"/><motion.span animate={{y: [0, -4, 0]}} transition={{duration: 0.8, repeat: Infinity, delay: 0.4}} className="w-2 h-2 bg-gray-300 rounded-full"/></div></motion.div>);
const DateSeparator = ({ text }) => (<motion.div variants={listItemVariants} className="text-center my-4"><span className="bg-gray-200 text-gray-500 text-xs font-semibold px-3 py-1 rounded-full">{text}</span></motion.div>);

// --- KOMPONEN UTAMA ---
const KomunitasPage = () => {
    // ... (state dan fungsi lainnya tetap sama)
    const [activeChat, setActiveChat] = useState(dummyContacts[0]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [activeFilter, setActiveFilter] = useState('Semua');
    const [availableEmojis, setAvailableEmojis] = useState(['👍', '❤️', '😂', '😮', '😢', '🙏', '🔥', '🎉', '🤔']);
    const [messageMenu, setMessageMenu] = useState(null);
    const [chatMenu, setChatMenu] = useState(null);
    const [viewedProfile, setViewedProfile] = useState(null);
    const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const [showEmojiTooltip, setShowEmojiTooltip] = useState(false);
    const [isShareMenuOpen, setShareMenuOpen] = useState(false);
    const [showShareTooltip, setShowShareTooltip] = useState(false);
    const shareMenuRef = useRef(null);

    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const plusMenuRef = useRef(null);
    const moreMenuRef = useRef(null);
    const emojiPickerRef = useRef(null);
    
    const showMessageContextMenu = (event, messageId) => { event.preventDefault(); event.stopPropagation(); const { clientX: x, clientY: y } = event; setMessageMenu({ x, y, messageId }); };
    const closeMessageContextMenu = () => setMessageMenu(null);
    const handleMessageMenuAction = (action, value) => { if (action === 'react' && value) { setAvailableEmojis(prev => { const filtered = prev.filter(e => e !== value); const newOrder = [value, ...filtered]; return newOrder; }); } console.log(`Aksi: ${action}, Pesan ID: ${messageMenu.messageId}, Nilai: ${value || ''}`); closeMessageContextMenu(); };
    const showChatContextMenu = (event, chat) => { setChatMenu({ x: event.clientX, y: event.clientY, chat: chat }); };
    const closeChatContextMenu = useCallback(() => setChatMenu(null), []);
    const handleChatMenuAction = (action, chatId) => { console.log(`Aksi: "${action}" pada chat ID: ${chatId}`); closeChatContextMenu(); };
    useEffect(() => { const handleClickOutside = (event) => { if (plusMenuRef.current && !plusMenuRef.current.contains(event.target)) setIsPlusMenuOpen(false); if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) setIsMoreMenuOpen(false); if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) { setEmojiPickerOpen(false); }; if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) { setShareMenuOpen(false); } }; document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, []);
    useEffect(() => { setMessages([]); setTimeout(() => { setMessages(dummyMessages[activeChat.id] || []); if(activeChat.id === 1) { setIsTyping(true); setTimeout(() => { setIsTyping(false); setMessages(prev => [...prev, {id: 'sim', text: 'Oke, ditunggu ya infonya!', sender: 'other', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]) }, 2500); } }, 300); }, [activeChat]);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);
    useEffect(() => { const handleKeyDown = (e) => { if (e.ctrlKey && e.key === 'e') { e.preventDefault(); setEmojiPickerOpen(prev => !prev); } if (e.ctrlKey && e.key === 'f') { e.preventDefault(); setShareMenuOpen(prev => !prev); } }; document.addEventListener('keydown', handleKeyDown); return () => { document.removeEventListener('keydown', handleKeyDown); }; }, []);
    const handleSendMessage = (e) => { e.preventDefault(); if (newMessage.trim() === '') return; const newMsg = { id: Date.now().toString(), text: newMessage, sender: 'me', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }; setMessages([...messages, newMsg]); setNewMessage(''); setEmojiPickerOpen(false); };
    const filteredContacts = dummyContacts.filter(c => { if(activeFilter === 'Grup') return c.isGroup; if(activeFilter === 'Belum Dibaca') return c.unread > 0; return true; });
    const handleAvatarClick = (event, user) => { event.stopPropagation(); setViewedProfile(user); };
    const onEmojiClick = (emojiObject) => { setNewMessage(prevInput => prevInput + emojiObject.emoji); };
    const handleShareMenuSelect = (type) => { console.log(`Pilih untuk membagikan tipe: ${type}`); setShareMenuOpen(false); };

    return (
        <>
            <style>{`.EmojiPickerReact .epr-body::-webkit-scrollbar { width: 8px; } .EmojiPickerReact .epr-body::-webkit-scrollbar-track { background: #f1f5f9; } .EmojiPickerReact .epr-body::-webkit-scrollbar-thumb { background-color: #93c5fd; border-radius: 20px; border: 2px solid #f1f5f9; } .EmojiPickerReact .epr-body::-webkit-scrollbar-thumb:hover { background-color: #60a5fa; }`}</style>
            
            <AnimatePresence>
                {messageMenu && <MessageActionMenu position={messageMenu} onClose={closeMessageContextMenu} onAction={handleMessageMenuAction} availableEmojis={availableEmojis} />}
                {chatMenu && <ChatActionMenu position={{ x: chatMenu.x, y: chatMenu.y }} chat={chatMenu.chat} onClose={closeChatContextMenu} onAction={handleChatMenuAction} />}
                {viewedProfile && <ProfileCardModal user={viewedProfile} onClose={() => setViewedProfile(null)} />}
            </AnimatePresence>

            <div className="w-full h-full flex font-sans overflow-hidden">
                <aside className="w-[350px] bg-slate-50 border-r border-slate-200 flex flex-col">
                    <div className="p-4 flex-shrink-0">
                        <div className="flex justify-between items-center mb-4 px-2"><h1 className="text-2xl font-bold text-gray-800">Obrolan</h1><div className="flex items-center gap-2"><div ref={plusMenuRef} className="relative"><motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)} className="p-2.5 rounded-full bg-white border border-gray-200 hover:bg-gray-100 transition-colors shadow-sm"><motion.div animate={{ rotate: isPlusMenuOpen ? 45 : 0 }} transition={{ duration: 0.3, ease: "easeOut" }}><FiPlus size={20} /></motion.div></motion.button><AnimatePresence>{isPlusMenuOpen && (<motion.div initial={{ opacity: 0, scale: 0.9, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.15 } }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-20 origin-top-right"><MenuItem icon={FiUserPlus} text="Tambah Teman" /><MenuItem icon={FiUsers} text="Buat Grup Baru" /><MenuItem icon={FiRadio} text="Buat Channel Baru" /><div className="h-px bg-gray-200 my-1"></div><MenuItem icon={FiBookmark} text="Pesan Tersimpan" /></motion.div>)}</AnimatePresence></div><div ref={moreMenuRef} className="relative"><motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)} className="p-2.5 rounded-full hover:bg-gray-100 transition-colors"><FiMoreVertical size={20} /></motion.button><AnimatePresence>{isMoreMenuOpen && (<motion.div initial={{ opacity: 0, scale: 0.9, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.15 } }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-20 origin-top-right"><MenuItem icon={FiUser} text="Profile" onClick={() => navigate('/beranda/profile')} /><MenuItem icon={FiSettings} text="Pengaturan" /><MenuItem icon={FiArchive} text="Arsip Obrolan" /><MenuItem icon={FiBellOff} text="Notifikasi & Suara" /></motion.div>)}</AnimatePresence></div></div></div>
                        <div className="relative"><FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Cari kontak atau grup" className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-full bg-white focus:ring-2 focus:ring-blue-400 outline-none transition-shadow" /></div>
                        <div className="flex items-center gap-2 mt-4"><button onClick={()=>setActiveFilter('Semua')} className={`px-4 py-1.5 text-sm font-semibold rounded-full ${activeFilter === 'Semua' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>Semua</button><button onClick={()=>setActiveFilter('Grup')} className={`px-4 py-1.5 text-sm font-semibold rounded-full ${activeFilter === 'Grup' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>Grup</button><button onClick={()=>setActiveFilter('Belum Dibaca')} className={`px-4 py-1.5 text-sm font-semibold rounded-full ${activeFilter === 'Belum Dibaca' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>Belum Dibaca</button></div>
                    </div>
                    <motion.div variants={listContainerVariants} initial="hidden" animate="visible" className="flex-1 overflow-y-auto p-4 pt-2 custom-scrollbar"><div className="space-y-1"><AnimatePresence>{filteredContacts.map(chat => (<ChatListItem key={chat.id} chat={chat} active={activeChat.id === chat.id} onClick={() => { setActiveChat(chat); closeChatContextMenu(); }} onContextMenu={showChatContextMenu} onAvatarClick={handleAvatarClick} />))}</AnimatePresence></div></motion.div>
                </aside>

                <main className="flex-1 bg-slate-100 flex flex-col min-w-0 chat-background">
                    {activeChat ? ( <> <div className="flex-shrink-0 flex items-center p-4 border-b bg-white/70 backdrop-blur-sm shadow-sm z-10"> <div className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer" onClick={() => setViewedProfile(activeChat)} > <Avatar contact={activeChat} size="lg" /> <div className="flex-1 min-w-0"> <h2 className="text-lg font-bold text-gray-900 truncate"> {activeChat.name} </h2> <p className="text-sm text-green-500"> {activeChat.online ? 'Online' : (activeChat.isGroup ? `${activeChat.members} anggota` : 'Offline')} </p> </div> </div> <div className="ml-auto flex items-center space-x-2"> <button className="p-2 rounded-full hover:bg-gray-200 text-gray-500"> <FiPhone /> </button> <button className="p-2 rounded-full hover:bg-gray-200 text-gray-500"> <FiVideo /> </button> </div> </div>
                    <motion.div variants={listContainerVariants} initial="hidden" animate="visible" className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar"> <AnimatePresence> {messages.map(msg => msg.type === 'date' ? <DateSeparator key={msg.id} text={msg.text}/> : <MessageBubble key={msg.id} msg={msg} onContextMenu={showMessageContextMenu} /> )} </AnimatePresence> {isTyping && <TypingIndicator/>} <div ref={messagesEndRef} /> </motion.div>
                    <div className="flex-shrink-0 p-4 bg-white mt-auto" >
                        <div className="relative">
                            <div ref={emojiPickerRef} className="absolute bottom-full left-0 mb-2 z-20">
                                <AnimatePresence>
                                    {isEmojiPickerOpen && ( <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15, ease: 'easeOut' }} > <EmojiPicker onEmojiClick={onEmojiClick} /> </motion.div> )}
                                </AnimatePresence>
                            </div>
                            <div ref={shareMenuRef} className="absolute bottom-full left-0 mb-2 z-20" style={{ transform: 'translateX(44px)' }}>
                                <AnimatePresence>
                                    {isShareMenuOpen && ( <AttachmentMenu onSelect={handleShareMenuSelect} /> )}
                                </AnimatePresence>
                            </div>
                            <form onSubmit={handleSendMessage} className="flex items-center space-x-3 bg-gray-100 rounded-full p-2 transition-shadow duration-300 input-chat">
                                <div className="relative">
                                    <button type="button" onClick={() => setEmojiPickerOpen(!isEmojiPickerOpen)} onMouseEnter={() => setShowEmojiTooltip(true)} onMouseLeave={() => setShowEmojiTooltip(false)} className="p-2 rounded-full hover:bg-gray-200 text-gray-500" > <FiSmile size={22}/> </button>
                                    <AnimatePresence> {showEmojiTooltip && ( <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs font-semibold rounded-md whitespace-nowrap" > Emoji (Ctrl+E) </motion.div> )} </AnimatePresence>
                                </div>
                                <div className="relative">
                                    <button type="button" onClick={() => setShareMenuOpen(!isShareMenuOpen)} onMouseEnter={() => setShowShareTooltip(true)} onMouseLeave={() => setShowShareTooltip(false)} className="p-2 rounded-full hover:bg-gray-200 text-gray-500"><FiPaperclip size={22}/></button>
                                    <AnimatePresence>
                                        {showShareTooltip && (
                                            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs font-semibold rounded-md whitespace-nowrap" >
                                                Bagikan (Ctrl+F)
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Ketik pesan di sini..." className="flex-1 px-2 py-2 bg-transparent focus:outline-none" />
                                <motion.button whileTap={{ scale: 0.9 }} whileHover={{scale: 1.1, y: -2}} type="submit" className="p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all"><FiSend size={20}/></motion.button>
                            </form>
                        </div>
                    </div>
                    </> ) : ( <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500"><FiMessageSquare size={64} /><h2 className="text-2xl font-semibold mt-4">Pilih Obrolan</h2><p>Mulai percakapan dengan memilih kontak dari daftar.</p></div> )}
                </main>
            </div>
        </>
    );
};

export default KomunitasPage;