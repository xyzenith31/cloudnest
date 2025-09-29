import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    FiSearch, FiMessageSquare, FiPlus, FiSend, FiSmile, FiPaperclip, FiMoreVertical, 
    FiPhone, FiVideo, FiUserPlus, FiUsers, FiRadio, FiBookmark, FiSettings, 
    FiArchive, FiBellOff, FiUser, FiThumbsUp, FiImage, FiFileText, FiLink, FiChevronDown, FiInfo,
    FiCornerUpLeft, FiCopy, FiShare, FiStar, FiTrash2, FiCheckSquare
} from 'react-icons/fi';

// --- FUNGSI & DATA DUMMY (Tidak Berubah) ---
const getInitials = (name) => { if (!name || typeof name !== 'string') return '?'; const nameParts = name.trim().split(' ').filter(Boolean); if (nameParts.length === 0) return '?'; if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase(); const firstInitial = nameParts[0][0]; const lastInitial = nameParts[nameParts.length - 1][0]; return `${firstInitial}${lastInitial}`.toUpperCase(); };
const dummyContacts = [ { id: 1, name: 'Alya Putri', avatar: 'https://i.pravatar.cc/150?u=alya', online: true, lastMessage: 'Siap, nanti aku kabari lagi ya!', timestamp: '10:45', unread: 2, color: 'bg-blue-500' }, { id: 2, name: 'Tim Desain Grafis', isGroup: true, lastMessage: 'Budi: Revisi logo sudah selesai.', timestamp: '09:15', unread: 0, color: 'bg-indigo-500', members: 5, description: 'Grup untuk koordinasi semua proyek desain.' }, { id: 3, name: 'Budi Santoso', online: false, lastMessage: 'Terima kasih atas bantuannya!', timestamp: 'Kemarin', unread: 0, color: 'bg-green-500' }, { id: 4, name: 'Citra Lestari', avatar: 'https://i.pravatar.cc/150?u=citra', online: true, lastMessage: 'Oke, aku tunggu.', timestamp: 'Kemarin', unread: 1, color: 'bg-pink-500' }, { id: 5, name: 'Rapat Proyek Internal', isGroup: true, lastMessage: 'Anda: Jangan lupa meeting jam 2 siang.', timestamp: '2 hari lalu', unread: 0, color: 'bg-purple-500', members: 8, description: 'Koordinasi mingguan untuk proyek A.' }, { id: 6, name: 'David Maulana', online: false, lastMessage: 'Proposal sudah saya kirim.', timestamp: '2 hari lalu', unread: 0, color: 'bg-red-500'}, { id: 7, name: 'Komunitas Fotografi', isGroup: true, lastMessage: 'Eka: Hunting foto weekend ini?', timestamp: '3 hari lalu', unread: 5, color: 'bg-yellow-500', members: 23, description: 'Berbagi tips & jadwal fotografi.'}, { id: 8, name: 'Project Manager', online: true, lastMessage: 'Tolong update progress hari ini.', timestamp: 'Baru Saja', unread: 1, color: 'bg-gray-500'}, { id: 9, name: 'HR Department', isGroup: true, lastMessage: 'Pengumuman: Libur nasional...', timestamp: '08:00', unread: 0, color: 'bg-cyan-500', members: 3, description: 'Informasi resmi dari HR.' },];
const dummyMessages = { 1: [ { id: 'date-1', type: 'date', text: 'Hari Ini' }, { id: 'a', text: 'Halo Alya, apa kabar?', sender: 'me', timestamp: '10:42' }, { id: 'b', text: 'Baik! Kamu gimana?', sender: 'other', timestamp: '10:43' }, { id: 'c', text: 'Aku juga baik. Nanti jadi kan kita diskusi proyek?', sender: 'me', timestamp: '10:44' }, { id: 'd', text: 'Jadi dong. Siap, nanti aku kabari lagi ya!', sender: 'other', timestamp: '10:45' } ], 2: [ { id: 'date-2', type: 'date', text: 'Kemarin' }, { id: 'f', text: 'Budi: Revisi logo sudah selesai, bisa dicek di folder "Revisi Final".', sender: 'other', timestamp: '09:15' } ], };

// --- VARIAN ANIMASI (Tidak Berubah) ---
const listContainerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
const listItemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } } };

// --- [DIPERBARUI] KOMPONEN MENU KONTEKS DENGAN SCROLL EMOJI ---
const MessageActionMenu = ({ position, onClose, onAction, availableEmojis }) => {
    const menuRef = useRef(null);

    useEffect(() => {
        const menu = menuRef.current;
        if (!menu) return;

        const handleClickOutside = (event) => {
            if (menu && !menu.contains(event.target)) onClose();
        };

        const calculatePosition = () => {
            const menuRect = menu.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const buffer = 10;

            let top = position.y;
            let left = position.x;
            
            if (top + menuRect.height > windowHeight - buffer) {
                top = position.y - menuRect.height;
            }
            if (left + menuRect.width > windowWidth - buffer) {
                left = windowWidth - menuRect.width - buffer;
            }
            
            top = Math.max(buffer, top);
            left = Math.max(buffer, left);

            menu.style.top = `${top}px`;
            menu.style.left = `${left}px`;
            menu.style.visibility = 'visible';
        };
        
        requestAnimationFrame(calculatePosition);

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("resize", onClose);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("resize", onClose);
        };
    }, [position, onClose]);

    const menuItems = [
        { icon: FiCornerUpLeft, text: 'Balas', action: 'reply' },
        { icon: FiCopy, text: 'Salin', action: 'copy' },
        { icon: FiShare, text: 'Teruskan', action: 'forward' },
        { icon: FiStar, text: 'Tandai', action: 'star' },
        { icon: FiCheckSquare, text: 'Pilih', action: 'select' },
        { icon: FiTrash2, text: 'Hapus', action: 'delete', isDanger: true },
    ];
    
    return (
        <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{ 
                position: 'fixed', 
                top: `${position.y}px`, 
                left: `${position.x}px`,
                visibility: 'hidden'
            }}
            className="bg-white rounded-xl shadow-2xl border border-gray-100 p-1 z-50 w-60 flex flex-col"
        >
            {/* [BARU] Wrapper untuk Emoji yang bisa di-scroll */}
            <div className="overflow-x-auto custom-scrollbar-horizontal border-b">
                <div className="flex items-center p-1 gap-1 whitespace-nowrap">
                    {availableEmojis.map(emoji => (
                        <button key={emoji} onClick={() => onAction('react', emoji)} className="p-2 rounded-full hover:bg-gray-200 transition-transform duration-200 transform hover:scale-125 text-xl flex-shrink-0">
                            {emoji}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 max-h-[250px]">
                {menuItems.map(item => (
                    <button
                        key={item.action}
                        onClick={() => onAction(item.action)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors text-sm ${
                            item.isDanger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <item.icon size={18} />
                        <span className="font-medium">{item.text}</span>
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

// --- KOMPONEN-KOMPONEN UI ---
const Avatar = ({ contact, size = 'md' }) => { const sizeClasses = { md: 'w-12 h-12 text-base', lg: 'w-16 h-16 text-xl' }; return (<div className={`relative flex-shrink-0 ${sizeClasses[size]}`}>{contact.avatar ? <img src={contact.avatar} alt={contact.name} className="w-full h-full rounded-full object-cover" /> : <div className={`w-full h-full rounded-full flex items-center justify-center font-bold text-white ${contact.color}`}><span>{getInitials(contact.name)}</span></div>}{contact.online && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white"></div>}</div>);};
const MenuItem = ({ icon: Icon, text, onClick }) => (<button onClick={onClick} className="w-full flex items-center gap-4 px-4 py-2.5 text-left text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"><Icon size={20} className="text-gray-500" /><span className="font-semibold">{text}</span></button>);
const ChatListItem = ({ chat, active, onClick }) => (<motion.div variants={listItemVariants} layout onClick={onClick} className={`flex items-center p-3 cursor-pointer rounded-xl transition-all duration-300 relative ${active ? 'bg-white shadow-md' : 'hover:bg-gray-100'}`}>{active && <motion.div layoutId="activeChatBubble" className="absolute inset-0 bg-blue-500 rounded-xl z-0"></motion.div>}<div className="relative z-10 flex items-center w-full"><Avatar contact={chat} /><div className="flex-1 overflow-hidden ml-4"><div className="flex justify-between items-center"><p className={`font-bold truncate ${active ? 'text-white' : 'text-gray-800'}`}>{chat.name}</p><span className={`text-xs flex-shrink-0 ${active ? 'text-blue-200' : 'text-gray-400'}`}>{chat.timestamp}</span></div><div className="flex justify-between items-start mt-1"><p className={`text-sm truncate ${active ? 'text-blue-100' : 'text-gray-500'}`}>{chat.lastMessage}</p>{chat.unread > 0 && (<motion.span initial={{scale:0}} animate={{scale:1}} className="bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{chat.unread}</motion.span>)}</div></div></div></motion.div>);

const MessageBubble = ({ msg, onContextMenu }) => {
    const isMe = msg.sender === 'me';
    const longPressTimer = useRef();

    const handleMouseDown = (e) => {
        if (e.button === 0) { 
            longPressTimer.current = setTimeout(() => {
                onContextMenu(e, msg.id);
            }, 500);
        }
    };
    const handleMouseUp = () => clearTimeout(longPressTimer.current);
    const handleTouchStart = (e) => {
         longPressTimer.current = setTimeout(() => {
            onContextMenu(e.touches[0], msg.id);
        }, 500);
    };
    const handleTouchEnd = () => clearTimeout(longPressTimer.current);

    return (
        <motion.div
            variants={listItemVariants}
            className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}
        >
            <motion.div
                layout
                className={`flex items-end gap-2 group max-w-xl ${isMe ? 'flex-row-reverse' : ''}`}
                onContextMenu={(e) => onContextMenu(e, msg.id)}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className={`p-3 px-4 rounded-t-2xl cursor-pointer ${
                        isMe
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-l-2xl'
                            : 'bg-white text-gray-800 rounded-r-2xl shadow-sm'
                    }`}
                >
                    <p className="text-base">{msg.text}</p>
                    <span className={`text-xs mt-1 block text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                        {msg.timestamp}
                    </span>
                </div>
            </motion.div>
        </motion.div>
    );
};

const TypingIndicator = () => (<motion.div variants={listItemVariants} className="flex items-end gap-2"><div className="max-w-md p-3 px-4 rounded-t-2xl bg-white text-gray-800 rounded-r-2xl shadow-sm flex items-center gap-1.5"><motion.span animate={{y: [0, -4, 0]}} transition={{duration: 0.8, repeat: Infinity}} className="w-2 h-2 bg-gray-300 rounded-full"/><motion.span animate={{y: [0, -4, 0]}} transition={{duration: 0.8, repeat: Infinity, delay: 0.2}} className="w-2 h-2 bg-gray-300 rounded-full"/><motion.span animate={{y: [0, -4, 0]}} transition={{duration: 0.8, repeat: Infinity, delay: 0.4}} className="w-2 h-2 bg-gray-300 rounded-full"/></div></motion.div>);
const DateSeparator = ({ text }) => (<motion.div variants={listItemVariants} className="text-center my-4"><span className="bg-gray-200 text-gray-500 text-xs font-semibold px-3 py-1 rounded-full">{text}</span></motion.div>);

const InfoPanel = ({ chat, onClose }) => (
    <motion.div initial={{x: '100%'}} animate={{x: 0}} exit={{x: '100%'}} transition={{type: 'spring', stiffness: 300, damping: 30}} className="w-[320px] bg-white border-l border-slate-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b flex-shrink-0 text-center flex flex-col items-center">
            <Avatar contact={chat} size="lg" />
            <h3 className="text-xl font-bold mt-3">{chat.name}</h3>
            <p className="text-sm text-gray-500">{chat.isGroup ? `${chat.members} Anggota` : (chat.online ? 'Online' : 'Offline')}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
            {chat.description && <div><h4 className="font-semibold text-gray-600 mb-2">Deskripsi</h4><p className="text-sm text-gray-800">{chat.description}</p></div>}
            <div><h4 className="font-semibold text-gray-600 mb-2">Media, File & Tautan</h4><div className="grid grid-cols-3 gap-2"><div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"><FiImage className="text-gray-400"/></div><div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"><FiFileText className="text-gray-400"/></div><div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs font-bold">12+</div></div></div>
            {chat.isGroup && <div><h4 className="font-semibold text-gray-600 mb-2">Anggota ({chat.members})</h4><div className="space-y-2"><div className="flex items-center gap-3"><Avatar contact={dummyContacts[0]} size="sm"/><span>Alya Putri</span></div><div className="flex items-center gap-3"><Avatar contact={dummyContacts[2]} size="sm"/><span>Budi Santoso (Admin)</span></div></div></div>}
            <div className="space-y-1 pt-4 border-t"><MenuItem icon={FiBellOff} text="Bisukan Notifikasi" /><MenuItem icon={FiArchive} text="Arsipkan Obrolan" /><MenuItem icon={FiTrash2} text="Hapus Obrolan" /></div>
        </div>
    </motion.div>
);

// --- KOMPONEN UTAMA ---
const KomunitasPage = () => {
    const [activeChat, setActiveChat] = useState(dummyContacts[0]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('Semua');
    
    // [BARU] State untuk emoji yang tersedia di menu
    const [availableEmojis, setAvailableEmojis] = useState(['👍', '❤️', '😂', '😮', '😢', '🙏', '🔥', '🎉', '🤔']);
    const [contextMenu, setContextMenu] = useState(null);

    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const plusMenuRef = useRef(null);
    const moreMenuRef = useRef(null);

    const showContextMenu = (event, messageId) => {
        event.preventDefault();
        event.stopPropagation();
        const { clientX: x, clientY: y } = event;
        setContextMenu({ x, y, messageId });
    };

    const closeContextMenu = () => setContextMenu(null);

    const handleMenuAction = (action, value) => {
        // Jika aksinya adalah 'react', perbarui daftar emoji
        if (action === 'react' && value) {
            setAvailableEmojis(prev => {
                // Hapus emoji yang dipilih jika sudah ada
                const filtered = prev.filter(e => e !== value);
                // Tambahkan emoji yang dipilih ke paling depan
                const newOrder = [value, ...filtered];
                return newOrder;
            });
        }
        console.log(`Aksi: ${action}, Pesan ID: ${contextMenu.messageId}, Nilai: ${value || ''}`);
        closeContextMenu();
    };


    useEffect(() => { const handleClickOutside = (event) => { if (plusMenuRef.current && !plusMenuRef.current.contains(event.target)) setIsPlusMenuOpen(false); if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) setIsMoreMenuOpen(false); }; document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, []);
    useEffect(() => { setMessages([]); setIsInfoPanelOpen(false); setTimeout(() => { setMessages(dummyMessages[activeChat.id] || []); if(activeChat.id === 1) { setIsTyping(true); setTimeout(() => { setIsTyping(false); setMessages(prev => [...prev, {id: 'sim', text: 'Oke, ditunggu ya infonya!', sender: 'other', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]) }, 2500); } }, 300); }, [activeChat]);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

    const handleSendMessage = (e) => { e.preventDefault(); if (newMessage.trim() === '') return; const newMsg = { id: Date.now().toString(), text: newMessage, sender: 'me', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }; setMessages([...messages, newMsg]); setNewMessage(''); };
    
    const filteredContacts = dummyContacts.filter(c => {
        if(activeFilter === 'Grup') return c.isGroup;
        if(activeFilter === 'Belum Dibaca') return c.unread > 0;
        return true;
    });

    return (
        <>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; } 
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } 
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; } 
                .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #94a3b8; } 
                .input-chat:focus-within { box-shadow: 0 0 0 2px #3b82f6; }
                /* [BARU] Style untuk scrollbar horizontal */
                .custom-scrollbar-horizontal::-webkit-scrollbar { height: 6px; }
                .custom-scrollbar-horizontal::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar-horizontal::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 20px; }
                .custom-scrollbar-horizontal:hover::-webkit-scrollbar-thumb { background-color: #cbd5e1; }
            `}</style>
            
            <AnimatePresence>
                {contextMenu && (
                    <MessageActionMenu
                        position={contextMenu}
                        onClose={closeContextMenu}
                        onAction={handleMenuAction}
                        availableEmojis={availableEmojis}
                    />
                )}
            </AnimatePresence>

            <div className="w-full h-full flex font-sans overflow-hidden">
                <aside className="w-[350px] bg-slate-50 border-r border-slate-200 flex flex-col">
                    <div className="p-4 flex-shrink-0">
                        <div className="flex justify-between items-center mb-4 px-2"><h1 className="text-2xl font-bold text-gray-800">Obrolan</h1><div className="flex items-center gap-2"><div ref={plusMenuRef} className="relative"><motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)} className="p-2.5 rounded-full bg-white border border-gray-200 hover:bg-gray-100 transition-colors shadow-sm"><motion.div animate={{ rotate: isPlusMenuOpen ? 45 : 0 }} transition={{ duration: 0.3, ease: "easeOut" }}><FiPlus size={20} /></motion.div></motion.button><AnimatePresence>{isPlusMenuOpen && (<motion.div initial={{ opacity: 0, scale: 0.9, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.15 } }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-20 origin-top-right"><MenuItem icon={FiUserPlus} text="Tambah Teman" /><MenuItem icon={FiUsers} text="Buat Grup Baru" /><MenuItem icon={FiRadio} text="Buat Channel Baru" /><div className="h-px bg-gray-200 my-1"></div><MenuItem icon={FiBookmark} text="Pesan Tersimpan" /></motion.div>)}</AnimatePresence></div><div ref={moreMenuRef} className="relative"><motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)} className="p-2.5 rounded-full hover:bg-gray-100 transition-colors"><FiMoreVertical size={20} /></motion.button><AnimatePresence>{isMoreMenuOpen && (<motion.div initial={{ opacity: 0, scale: 0.9, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.15 } }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-20 origin-top-right"><MenuItem icon={FiUser} text="Profile" onClick={() => navigate('/beranda/profile')} /><MenuItem icon={FiSettings} text="Pengaturan" /><MenuItem icon={FiArchive} text="Arsip Obrolan" /><MenuItem icon={FiBellOff} text="Notifikasi & Suara" /></motion.div>)}</AnimatePresence></div></div></div>
                        <div className="relative"><FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Cari kontak atau grup" className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-full bg-white focus:ring-2 focus:ring-blue-400 outline-none transition-shadow" /></div>
                        <div className="flex items-center gap-2 mt-4"><button onClick={()=>setActiveFilter('Semua')} className={`px-4 py-1.5 text-sm font-semibold rounded-full ${activeFilter === 'Semua' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>Semua</button><button onClick={()=>setActiveFilter('Grup')} className={`px-4 py-1.5 text-sm font-semibold rounded-full ${activeFilter === 'Grup' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>Grup</button><button onClick={()=>setActiveFilter('Belum Dibaca')} className={`px-4 py-1.5 text-sm font-semibold rounded-full ${activeFilter === 'Belum Dibaca' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>Belum Dibaca</button></div>
                    </div>
                    <motion.div variants={listContainerVariants} initial="hidden" animate="visible" className="flex-1 overflow-y-auto p-4 pt-2 custom-scrollbar"><div className="space-y-1"><AnimatePresence>{filteredContacts.map(chat => (<ChatListItem key={chat.id} chat={chat} active={activeChat.id === chat.id} onClick={() => setActiveChat(chat)} />))}</AnimatePresence></div></motion.div>
                </aside>

                <main className="flex-1 bg-slate-100 flex flex-col min-w-0">
                    {activeChat ? ( <> <div className="flex-shrink-0 flex items-center p-4 border-b bg-white/70 backdrop-blur-sm shadow-sm z-10"> <Avatar contact={activeChat} size="lg" /> <div className="ml-4 flex-1 min-w-0"><h2 className="text-lg font-bold text-gray-900 truncate">{activeChat.name}</h2><p className="text-sm text-green-500">{activeChat.online ? 'Online' : (activeChat.isGroup ? `${activeChat.members} anggota` : 'Offline')}</p></div> <div className="ml-auto flex items-center space-x-2"><button className="p-2 rounded-full hover:bg-gray-200 text-gray-500"><FiPhone /></button><button className="p-2 rounded-full hover:bg-gray-200 text-gray-500"><FiVideo /></button><button onClick={()=> setIsInfoPanelOpen(!isInfoPanelOpen)} className={`p-2 rounded-full text-gray-500 transition-colors ${isInfoPanelOpen ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}><FiInfo /></button></div> </div>
                    <motion.div variants={listContainerVariants} initial="hidden" animate="visible" className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar"> 
                        <AnimatePresence>
                            {messages.map(msg => 
                                msg.type === 'date' 
                                ? <DateSeparator key={msg.id} text={msg.text}/> 
                                : <MessageBubble key={msg.id} msg={msg} onContextMenu={showContextMenu} />
                            )}
                        </AnimatePresence>
                        {isTyping && <TypingIndicator/>}
                        <div ref={messagesEndRef} />
                    </motion.div>
                    <div className="flex-shrink-0 p-4 bg-white mt-auto"> <form onSubmit={handleSendMessage} className="flex items-center space-x-3 bg-gray-100 rounded-full p-2 transition-shadow duration-300 input-chat"> <button type="button" className="p-2 rounded-full hover:bg-gray-200 text-gray-500"><FiSmile size={22}/></button> <button type="button" className="p-2 rounded-full hover:bg-gray-200 text-gray-500"><FiPaperclip size={22}/></button> <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Ketik pesan di sini..." className="flex-1 px-2 py-2 bg-transparent focus:outline-none" /> <motion.button whileTap={{ scale: 0.9 }} whileHover={{scale: 1.1}} type="submit" className="p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"><FiSend size={20}/></motion.button> </form> </div> </> ) : ( <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500"><FiMessageSquare size={64} /><h2 className="text-2xl font-semibold mt-4">Pilih Obrolan</h2><p>Mulai percakapan dengan memilih kontak dari daftar.</p></div> )}
                </main>
                
                <AnimatePresence>
                    {isInfoPanelOpen && activeChat && <InfoPanel chat={activeChat} onClose={() => setIsInfoPanelOpen(false)}/>}
                </AnimatePresence>
            </div>
        </>
    );
};

export default KomunitasPage;