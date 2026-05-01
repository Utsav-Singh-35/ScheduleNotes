import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import useStore from '../store/useStore';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

export default function DashboardScreen() {
  const { tasks, events } = useStore();
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length || 1; // prevent div 0
  const completionRate = Math.round((completedTasks / totalTasks) * 100);
  
  const todayDate = new Date().toISOString().split('T')[0];
  const todaysEvents = events[todayDate] || [];

  // Generate a random-ish dot grid based on completion rate
  const renderDotGrid = () => {
    let dots = [];
    const totalDots = 35; // 5x7
    const activeDots = Math.floor((completionRate / 100) * totalDots);
    for (let i = 0; i < totalDots; i++) {
      dots.push(
        <View 
          key={i} 
          style={[
            styles.dot, 
            { backgroundColor: i < activeDots ? colors.primary : '#2A302D' }
          ]} 
        />
      );
    }
    return <View style={styles.dotGrid}>{dots}</View>;
  };

  // Ring Chart sizing
  const size = 120;
  const strokeWidth = 14;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <Image source={require('../../assets/logo.png')} style={styles.avatarPlaceholder} />
          </View>
          <Ionicons name="notifications-outline" size={26} color={colors.text} />
        </View>

        <Text style={styles.greeting}>Hello, User</Text>
        <Text style={styles.title}>How're You Today?</Text>

        {/* Date Row */}
        <View style={styles.dateRow}>
          {['17','18','19','20','21','22','23'].map((day, i) => (
            <View key={i} style={[styles.dateBubble, day === '20' && styles.dateBubbleActive]}>
              <Text style={[styles.dateBubbleDay, day === '20' && styles.dateTextActive]}>Mon</Text>
              <Text style={[styles.dateText, day === '20' && styles.dateTextActive]}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Widget Grid */}
        <View style={styles.grid}>
          {/* Left Column */}
          <View style={styles.columnLeft}>
            {/* Dot Grid Card */}
            <View style={styles.widgetCard}>
              <Text style={styles.widgetTitle}><Ionicons name="apps" size={14} /> Activity Score</Text>
              <Text style={styles.mainStat}>{completedTasks}/{tasks.length === 0 ? 0 : totalTasks}</Text>
              {renderDotGrid()}
            </View>

            {/* Bar Chart Card */}
            <View style={[styles.widgetCard, { marginTop: 15 }]}>
              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end', marginBottom: 10}}>
                 <Text style={styles.widgetTitle}><Ionicons name="stats-chart" size={14} /> Growth</Text>
                 <Text style={[styles.widgetTitle, {color: colors.text}]}>{tasks.length === 0 ? 0 : completionRate}%</Text>
              </View>
              <View style={styles.barChartContainer}>
                 {[40, 60, 30, 80].map((h, i) => (
                   <View key={i} style={styles.barWrapper}>
                     <View style={[styles.bar, {height: `${h}%`}]} />
                   </View>
                 ))}
              </View>
            </View>
          </View>

          {/* Right Column */}
          <View style={styles.columnRight}>
             {/* Simple Stats */}
             <View style={styles.widgetCard}>
               <Text style={styles.widgetTitle}><Ionicons name="calendar" size={14}/> Today</Text>
               <Text style={styles.mainStat}>{todaysEvents.length} Events</Text>
             </View>

             {/* Donut Chart Card */}
             <View style={[styles.widgetCard, { marginTop: 15, alignItems: 'center' }]}>
               <Text style={[styles.widgetTitle, {alignSelf: 'flex-start'}]}><Ionicons name="pie-chart" size={14}/> Task Split</Text>
               <View style={{ marginVertical: 10 }}>
                 <Svg width={size} height={size}>
                   <G rotation="-90" origin={`${center}, ${center}`}>
                     <Circle stroke="#2A302D" cx={center} cy={center} r={radius} strokeWidth={strokeWidth} fill="transparent" />
                     <Circle 
                        stroke={colors.secondary} 
                        cx={center} 
                        cy={center} 
                        r={radius} 
                        strokeWidth={strokeWidth} 
                        fill="transparent" 
                        strokeDasharray={circumference} 
                        strokeDashoffset={strokeDashoffset} 
                        strokeLinecap="round" 
                     />
                   </G>
                   <SvgText x={center} y={center} fill={colors.text} fontSize="20" fontWeight="bold" textAnchor="middle" alignmentBaseline="central">
                     {completedTasks}
                   </SvgText>
                 </Svg>
               </View>
               <View style={{flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 5}}>
                 <View style={{flexDirection:'row', alignItems:'center'}}>
                   <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor: colors.secondary, marginRight: 4}}/>
                   <Text style={{color: colors.textSecondary, fontSize: 10}}>Done</Text>
                 </View>
                 <View style={{flexDirection:'row', alignItems:'center'}}>
                   <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor: '#2A302D', marginRight: 4}}/>
                   <Text style={{color: colors.textSecondary, fontSize: 10}}>Pending</Text>
                 </View>
               </View>
             </View>
          </View>
        </View>

        {/* Schedule Preview */}
        <View style={styles.widgetCard}>
          <Text style={[styles.widgetTitle, {marginBottom: 15, fontSize: 16, color: colors.text}]}>Upcoming Today</Text>
          {todaysEvents.length === 0 ? (
            <Text style={styles.emptyText}>No events scheduled for today.</Text>
          ) : (
            todaysEvents.map(event => (
              <View key={event.id} style={styles.eventItem}>
                <View style={styles.eventDot} />
                <View style={{flex: 1}}>
                  <Text style={styles.eventName}>{event.title}</Text>
                  <Text style={styles.eventTime}>{event.time}</Text>
                </View>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  avatarWrapper: { backgroundColor: '#FFFFFF', padding: 2, borderRadius: 24, overflow: 'hidden' },
  avatarPlaceholder: { width: 40, height: 40, resizeMode: 'cover' },
  greeting: { color: colors.textSecondary, fontSize: 16, marginBottom: 5 },
  title: { color: colors.text, fontSize: 32, fontWeight: 'bold', marginBottom: 25 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  dateBubble: { width: 45, height: 60, borderRadius: 22, backgroundColor: colors.card, justifyContent: 'center', alignItems: 'center' },
  dateBubbleActive: { backgroundColor: colors.primary },
  dateBubbleDay: { color: colors.textSecondary, fontSize: 10, marginBottom: 4 },
  dateText: { color: colors.textSecondary, fontSize: 16, fontWeight: 'bold' },
  dateTextActive: { color: '#000000' },
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  columnLeft: { width: '48%' },
  columnRight: { width: '48%' },
  widgetCard: { backgroundColor: colors.card, borderRadius: 24, padding: 18 },
  widgetTitle: { color: colors.textSecondary, fontSize: 12, fontWeight: '600', marginBottom: 8 },
  mainStat: { color: colors.text, fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  dotGrid: { flexDirection: 'row', flexWrap: 'wrap', width: '100%', gap: 6, justifyContent: 'center', paddingVertical: 10 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  barChartContainer: { flexDirection: 'row', justifyContent: 'space-between', height: 60, alignItems: 'flex-end', marginTop: 10 },
  barWrapper: { width: 18, height: '100%', backgroundColor: '#2A302D', borderRadius: 6, justifyContent: 'flex-end' },
  bar: { width: '100%', backgroundColor: colors.accentPurple, borderRadius: 6 },
  emptyText: { color: colors.textSecondary, fontStyle: 'italic', marginBottom: 10 },
  eventItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, padding: 15, borderRadius: 16, marginBottom: 10 },
  eventDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.secondary, marginRight: 15 },
  eventName: { color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 4 },
  eventTime: { color: colors.textSecondary, fontSize: 14 },
});
