import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStore = create(
  persist(
    (set) => ({
      tasks: [],
      events: {},
      notes: [],
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, { id: Date.now().toString(), completed: false, ...task }] })),
      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task)
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id)
      })),
      addEvent: (date, event) => set((state) => {
        const dateEvents = state.events[date] || [];
        return {
          events: { ...state.events, [date]: [...dateEvents, { id: Date.now().toString(), ...event }] }
        };
      }),
      deleteEvent: (date, id) => set((state) => {
        const dateEvents = state.events[date] || [];
        return {
          events: { ...state.events, [date]: dateEvents.filter(e => e.id !== id) }
        };
      }),
      addNote: (note) => set((state) => ({ notes: [...state.notes, { id: Date.now().toString(), date: new Date().toISOString(), ...note }] })),
      deleteNote: (id) => set((state) => ({ notes: state.notes.filter(n => n.id !== id) })),
    }),
    {
      name: 'schedule-notes-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useStore;
