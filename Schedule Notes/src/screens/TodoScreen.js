import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import useStore from '../store/useStore';

export default function TodoScreen() {
  const { tasks, addTask, toggleTask, deleteTask } = useStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask({ title: newTaskTitle });
      setNewTaskTitle('');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskCard}>
      <TouchableOpacity 
        style={styles.taskCardTouch} 
        onPress={() => toggleTask(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, item.completed && styles.checkboxActive]}>
          {item.completed && <Ionicons name="checkmark" size={16} color="#000" />}
        </View>
        <Text style={[styles.taskTitle, item.completed && styles.taskTitleDone]}>
          {item.title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteTask(item.id)}>
        <Ionicons name="trash-outline" size={20} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>To-Do List</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="What needs to be done?"
          placeholderTextColor={colors.textSecondary}
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
          onSubmitEditing={handleAddTask}
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAddTask}>
          <Ionicons name="add" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks yet. Add one above!</Text>}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  headerTitle: { color: colors.text, fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  inputContainer: { flexDirection: 'row', marginBottom: 25 },
  input: { flex: 1, backgroundColor: colors.card, color: colors.text, paddingHorizontal: 20, paddingVertical: 18, borderRadius: 16, fontSize: 16, marginRight: 12 },
  addBtn: { backgroundColor: colors.primary, width: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingBottom: 30 },
  taskCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, padding: 10, paddingLeft: 15, borderRadius: 16, marginBottom: 12 },
  taskCardTouch: { flexDirection: 'row', flex: 1, alignItems: 'center', paddingVertical: 8 },
  checkbox: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: colors.textSecondary, marginRight: 15, justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  taskTitle: { color: colors.text, fontSize: 17, flex: 1 },
  taskTitleDone: { color: colors.textSecondary, textDecorationLine: 'line-through' },
  deleteBtn: { padding: 10 },
  emptyText: { color: colors.textSecondary, textAlign: 'center', marginTop: 40, fontStyle: 'italic', fontSize: 16 },
});
