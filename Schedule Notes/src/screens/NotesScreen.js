import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import useStore from '../store/useStore';

export default function NotesScreen() {
  const { notes, addNote, deleteNote } = useStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const handleAddNote = () => {
    if (newNoteTitle || newNoteContent) {
      addNote({ title: newNoteTitle, content: newNoteContent });
      setModalVisible(false);
      setNewNoteTitle('');
      setNewNoteContent('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Personal Notes</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.notesGrid}>
        {notes.map(note => (
          <TouchableOpacity 
            key={note.id} 
            style={styles.noteCard}
            onPress={() => {
              setSelectedNote(note);
              setViewModalVisible(true);
            }}
          >
            <View style={styles.noteCardHeader}>
              <Text style={styles.noteTitle} numberOfLines={1}>{note.title}</Text>
              <TouchableOpacity onPress={() => deleteNote(note.id)}>
                <Ionicons name="trash-outline" size={16} color={colors.danger || '#FF4C4C'} />
              </TouchableOpacity>
            </View>
            <Text style={styles.noteContent} numberOfLines={3}>{note.content}</Text>
            <Text style={styles.noteDate}>
              {new Date(note.date).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Note Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Note</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Title"
              placeholderTextColor={colors.textSecondary}
              value={newNoteTitle}
              onChangeText={setNewNoteTitle}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Start writing..."
              placeholderTextColor={colors.textSecondary}
              multiline
              textAlignVertical="top"
              value={newNoteContent}
              onChangeText={setNewNoteContent}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddNote}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* View Note Modal */}
      <Modal visible={viewModalVisible} animationType="fade" transparent>
        <View style={styles.viewModalContainer}>
          <View style={styles.viewModalContent}>
            <View style={styles.viewModalHeader}>
              <Text style={styles.viewModalTitle}>{selectedNote?.title}</Text>
              <TouchableOpacity onPress={() => setViewModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.viewModalDate}>
              {selectedNote && new Date(selectedNote.date).toLocaleDateString()}
            </Text>
            <ScrollView style={styles.viewModalBody}>
              <Text style={styles.viewModalText}>{selectedNote?.content}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { color: colors.text, fontSize: 28, fontWeight: 'bold' },
  addButton: { backgroundColor: colors.primary, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  notesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  noteCard: { backgroundColor: colors.card, width: '48%', borderRadius: 16, padding: 15, marginBottom: 15 },
  noteCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  noteTitle: { color: colors.text, fontSize: 16, fontWeight: '600', flex: 1, marginRight: 5 },
  noteContent: { color: colors.textSecondary, fontSize: 14, marginBottom: 10, flex: 1 },
  noteDate: { color: colors.textSecondary, fontSize: 10, marginTop: 'auto' },
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, height: '80%' },
  modalTitle: { color: colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: colors.background, color: colors.text, padding: 15, borderRadius: 12, marginBottom: 15, fontSize: 16 },
  textArea: { flex: 1, minHeight: 150 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  cancelBtn: { padding: 15 },
  cancelBtnText: { color: colors.textSecondary, fontSize: 16 },
  saveBtn: { backgroundColor: colors.primary, padding: 15, borderRadius: 12, marginLeft: 10 },
  saveBtnText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  viewModalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)', padding: 20 },
  viewModalContent: { backgroundColor: colors.card, borderRadius: 24, padding: 24, maxHeight: '80%' },
  viewModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  viewModalTitle: { color: colors.text, fontSize: 24, fontWeight: 'bold', flex: 1, marginRight: 10 },
  viewModalDate: { color: colors.textSecondary, fontSize: 12, marginBottom: 20 },
  viewModalBody: { marginTop: 10 },
  viewModalText: { color: colors.text, fontSize: 16, lineHeight: 24 },
});
