import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import useStore from '../store/useStore';
import Svg, { Circle, G, Text as SvgText, Defs, DropShadow } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { tasks, events } = useStore();
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length || 1; // prevent div 0
  const completionRate = Math.round((completedTasks / totalTasks) * 100);
  
  const todayDate = new Date().toISOString().split('T')[0];
  const todaysEvents = events[todayDate] || [];

  // Generate dynamic dates (3 days before, today, 3 days after)
  const dynamicDates = useMemo(() => {
    const today = new Date();
    const dates = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({
        dayName: d.toLocaleString('en-US', { weekday: 'short' }),
        dateNum: d.getDate(),
        isToday: i === 0
      });
    }
    return dates;
  }, []);

  // Generate a high-density heatmap dot grid
  const renderDotGrid = () => {
    let dots = [];
    const totalDots = 60; // 6x10 grid
    
    for (let i = 0; i < totalDots; i++) {
      const isActive = (i * totalTasks * 11) % 100 < 35; 
      dots.push(
        <View 
          key={i} 
          style={[
            styles.dot, 
            { backgroundColor: isActive ? colors.primary : 'rgba(255,255,255,0.05)' }
          ]} 
        />
      );
    }
    return <View style={styles.dotGrid}>{dots}</View>;
  };

  // Ring Chart sizing
  const size = 110;
  const strokeWidth = 14;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  return (
    <LinearGradient colors={['#141716', '#000000']} style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.avatarWrapper}>
              <Image source={require('../../assets/logo.png')} style={styles.avatarPlaceholder} />
            </View>
            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications" size={22} color={colors.text} />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>

          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.title}>Ready to crush it?</Text>

          {/* Date Row */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow} style={{marginBottom: 30}}>
            {dynamicDates.map((item, i) => (
              <View key={i} style={[styles.dateBubble, item.isToday && styles.dateBubbleActive]}>
                <Text style={[styles.dateBubbleDay, item.isToday && styles.dateTextActive]}>{item.dayName}</Text>
                <Text style={[styles.dateText, item.isToday && styles.dateTextActive]}>{item.dateNum}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Widget Grid */}
          <View style={styles.grid}>
            {/* Left Column */}
            <View style={styles.columnLeft}>
              {/* Activity Card */}
              <View style={styles.widgetCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconBadge}>
                    <Ionicons name="flash" size={16} color={colors.primary} />
                  </View>
                  <Text style={styles.widgetTitle}>Activity</Text>
                </View>
                <Text style={styles.mainStat}>{totalTasks * 3}</Text>
                <Text style={styles.subStat}>actions this month</Text>
                {renderDotGrid()}
              </View>

              {/* Growth Bar Chart */}
              <View style={[styles.widgetCard, { marginTop: 15 }]}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconBadge}>
                    <Ionicons name="stats-chart" size={16} color={colors.accentPurple} />
                  </View>
                  <Text style={styles.widgetTitle}>Growth</Text>
                </View>
                <Text style={styles.mainStat}>{tasks.length === 0 ? 0 : completionRate}%</Text>
                
                <View style={styles.barChartContainer}>
                   {[40, 70, 45, 90].map((h, i) => (
                     <View key={i} style={styles.barWrapper}>
                       <LinearGradient 
                         colors={[colors.accentPurple, '#593CA1']} 
                         style={[styles.bar, {height: `${h}%`}]} 
                       />
                     </View>
                   ))}
                </View>
              </View>
            </View>

            {/* Right Column */}
            <View style={styles.columnRight}>
               {/* Today Stats */}
               <LinearGradient colors={[colors.primary, '#A5C100']} style={styles.highlightCard}>
                 <View style={styles.cardHeader}>
                   <View style={[styles.iconBadge, {backgroundColor: 'rgba(0,0,0,0.1)'}]}>
                     <Ionicons name="calendar" size={16} color="#000" />
                   </View>
                   <Text style={[styles.widgetTitle, {color: '#000'}]}>Today</Text>
                 </View>
                 <Text style={[styles.mainStat, {color: '#000'}]}>{todaysEvents.length}</Text>
                 <Text style={{color: 'rgba(0,0,0,0.7)', fontSize: 12, fontWeight: '600'}}>Events scheduled</Text>
               </LinearGradient>

               {/* Donut Chart Card */}
               <View style={[styles.widgetCard, { marginTop: 15 }]}>
                 <View style={styles.cardHeader}>
                   <View style={styles.iconBadge}>
                     <Ionicons name="pie-chart" size={16} color="#45E6FE" />
                   </View>
                   <Text style={styles.widgetTitle}>Tasks</Text>
                 </View>
                 
                 <View style={{ alignItems: 'center', marginVertical: 15 }}>
                   <Svg width={size} height={size}>
                     <Defs>
                       <DropShadow id="shadow" dx="0" dy="0" stdDeviation="6" floodColor={colors.accentPurple} floodOpacity="0.8" />
                     </Defs>
                     <G rotation="-90" origin={`${center}, ${center}`}>
                       <Circle stroke="rgba(255,255,255,0.05)" cx={center} cy={center} r={radius} strokeWidth={strokeWidth} fill="transparent" />
                       <Circle 
                          stroke={colors.accentPurple} 
                          cx={center} 
                          cy={center} 
                          r={radius} 
                          strokeWidth={strokeWidth} 
                          fill="transparent" 
                          strokeDasharray={circumference} 
                          strokeDashoffset={strokeDashoffset} 
                          strokeLinecap="round" 
                          filter="url(#shadow)"
                       />
                     </G>
                     <SvgText x={center} y={center} fill={colors.text} fontSize="28" fontWeight="bold" textAnchor="middle" alignmentBaseline="central">
                       {completedTasks}
                     </SvgText>
                   </Svg>
                 </View>
                 
                 <View style={styles.legendRow}>
                   <View style={styles.legendItem}>
                     <View style={[styles.legendDot, {backgroundColor: colors.accentPurple}]} />
                     <Text style={styles.legendText}>Done</Text>
                   </View>
                   <View style={styles.legendItem}>
                     <View style={[styles.legendDot, {backgroundColor: 'rgba(255,255,255,0.1)'}]} />
                     <Text style={styles.legendText}>To do</Text>
                   </View>
                 </View>
               </View>
            </View>
          </View>

          {/* Schedule Preview */}
          <Text style={styles.sectionHeader}>Upcoming Today</Text>
          {todaysEvents.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="cafe-outline" size={32} color="rgba(255,255,255,0.2)" />
              <Text style={styles.emptyText}>You're all clear for today.</Text>
            </View>
          ) : (
            todaysEvents.map(event => (
              <View key={event.id} style={styles.eventItem}>
                <View style={styles.eventLeftBorder} />
                <View style={styles.eventContent}>
                  <Text style={styles.eventName}>{event.title}</Text>
                  <Text style={styles.eventTime}>
                    <Ionicons name="time-outline" size={12} /> {event.time}
                  </Text>
                </View>
                <TouchableOpacity style={styles.eventGoBtn}>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            ))
          )}

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  avatarWrapper: { 
    backgroundColor: '#FFFFFF', 
    padding: 3, 
    borderRadius: 32, 
    overflow: 'hidden',
    shadowColor: colors.primary, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 10,
    elevation: 8,
  },
  avatarPlaceholder: { width: 56, height: 56, resizeMode: 'cover', borderRadius: 28 },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger || '#FF3B30',
    borderWidth: 2,
    borderColor: '#141716'
  },
  greeting: { color: colors.textSecondary, fontSize: 16, marginBottom: 4, fontWeight: '500' },
  title: { color: colors.text, fontSize: 34, fontWeight: '800', letterSpacing: -0.5, marginBottom: 30 },
  dateRow: { flexDirection: 'row', gap: 12 },
  dateBubble: { 
    width: 55, 
    height: 75, 
    borderRadius: 20, 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 12,
  },
  dateBubbleActive: { 
    backgroundColor: colors.primary, 
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  dateBubbleDay: { color: colors.textSecondary, fontSize: 12, fontWeight: '600', marginBottom: 6 },
  dateText: { color: colors.text, fontSize: 20, fontWeight: 'bold' },
  dateTextActive: { color: '#000000' },
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  columnLeft: { width: '48%' },
  columnRight: { width: '48%' },
  widgetCard: { 
    backgroundColor: 'rgba(255,255,255,0.02)', 
    borderRadius: 28, 
    padding: 20, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.08)',
  },
  highlightCard: {
    borderRadius: 28, 
    padding: 20, 
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  widgetTitle: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
  mainStat: { color: colors.text, fontSize: 32, fontWeight: '800', letterSpacing: -1 },
  subStat: { color: colors.textSecondary, fontSize: 11, marginTop: 2, marginBottom: 15 },
  dotGrid: { flexDirection: 'row', flexWrap: 'wrap', width: '100%', gap: 4, marginTop: 5 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  barChartContainer: { flexDirection: 'row', justifyContent: 'space-between', height: 60, alignItems: 'flex-end', marginTop: 20 },
  barWrapper: { width: 14, height: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 7, justifyContent: 'flex-end', overflow: 'hidden' },
  bar: { width: '100%', borderRadius: 7 },
  legendRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  legendText: { color: colors.textSecondary, fontSize: 12, fontWeight: '500' },
  sectionHeader: { color: colors.text, fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  emptyStateContainer: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderStyle: 'dashed',
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: { color: colors.textSecondary, marginTop: 10, fontSize: 14 },
  eventItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    borderRadius: 20, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden'
  },
  eventLeftBorder: {
    width: 6,
    height: '100%',
    backgroundColor: colors.primary,
  },
  eventContent: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  eventName: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 6 },
  eventTime: { color: colors.textSecondary, fontSize: 13, fontWeight: '500' },
  eventGoBtn: {
    padding: 20,
  }
});
