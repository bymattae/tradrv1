'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Invite = {
  email: string;
  status: 'pending' | 'signed_up' | 'not_joined';
  invitedAt: Date;
};

type BattleInviteModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function BattleInviteModal({ isOpen, onClose }: BattleInviteModalProps) {
  const [email, setEmail] = useState('');
  const [invites, setInvites] = useState<Invite[]>([]);

  const handleAddInvite = () => {
    if (!email || !email.includes('@')) return;
    
    setInvites([
      ...invites,
      {
        email,
        status: 'pending',
        invitedAt: new Date()
      }
    ]);
    setEmail('');
  };

  const handleSendInvites = () => {
    // TODO: Implement sending invites
    console.log('Sending invites:', invites);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md p-6"
            onClick={e => e.stopPropagation()}
          >
            {/* Title Section */}
            <div className="text-center mb-6">
              <motion.h2 
                className="text-2xl font-bold mb-2 flex items-center justify-center gap-2"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
              >
                INVITE CHALLENGERS
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ⚔️
                </motion.span>
              </motion.h2>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Add friends to battle when they join!
              </motion.p>
            </div>

            {/* Input Section */}
            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="flex-1 border-2 border-black p-2 focus:outline-none"
                />
                <motion.button
                  onClick={handleAddInvite}
                  whileTap={{ scale: 0.95 }}
                  className="bg-yellow-400 border-2 border-black px-4 font-bold hover:bg-yellow-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-y-1"
                >
                  ADD
                </motion.button>
              </div>
            </div>

            {/* Invites List */}
            <div className="mb-6">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                INVITED FRIENDS
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🤺
                </motion.span>
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {invites.map((invite, index) => (
                  <motion.div
                    key={invite.email + index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="bg-gray-50 border-2 border-black p-2 flex justify-between items-center"
                  >
                    <span className="font-mono">{invite.email}</span>
                    <span className={`text-sm font-bold ${
                      invite.status === 'signed_up' ? 'text-green-500' :
                      invite.status === 'not_joined' ? 'text-red-500' :
                      'text-yellow-500'
                    }`}>
                      {invite.status.toUpperCase().replace('_', ' ')}
                    </span>
                  </motion.div>
                ))}
                {invites.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    No invites yet. Add some friends!
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <motion.button
                onClick={onClose}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-gray-200 border-2 border-black p-2 font-bold hover:bg-gray-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-y-1"
              >
                CLOSE
              </motion.button>
              <motion.button
                onClick={handleSendInvites}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-green-400 border-2 border-black p-2 font-bold hover:bg-green-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-y-1"
              >
                SEND INVITES
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 