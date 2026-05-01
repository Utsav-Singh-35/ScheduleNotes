import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import useStore from '../store/useStore';

export default function TodoScreen() {
  const { tasks, addTask, toggleTask } = useStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask({ title: newTaskTitle });
      setNewTaskTitle('');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.taskCard} onPress={() => toggleTask(item.id)}>
      <View style={[styles.checkbox, item.completed && styles.checkboxActive]}>
        {item.completed && <Ionicons name="checkmark" size={16} color="#000" />}
      </View>
      <Text style={[styles.taskTitle, item.completed && styles.taskTitleDone]}>
        {item.title}
      </Text>
    </TouchableOpacity>
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
          <Ionicons name="add" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks yet. Add one above!</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  headerTitle: { color: colors.text, fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, backgroundColor: colors.card, color: colors.text, padding: 15, borderRadius: 12, fontSize: 16, marginRight: 10 },
  addBtn: { backgroundColor: colors.primary, width: 54, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingBottom: 20 },
  taskCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, padding: 15, borderRadius: 12, marginBottom: 10 },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.textSecondary, marginRight: 15, justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  taskTitle: { color: colors.text, fontSize: 16, flex: 1 },
  taskTitleDone: { color: colors.textSecondary, textDecorationLine: 'line-through' },
  emptyText: { color: colors.textSecondary, textAlign: 'center', marginTop: 40, fontStyle: 'italic' },
});
