import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import useStore from '../store/useStore';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

export default function DashboardScreen() {
  const { tasks, events } = useStore();
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length || 1; 
  const completionRate = Math.round((completedTasks / totalTasks) * 100);
  
  const todayDate = new Date().toISOString().split('T')[0];
  const todaysEvents = events[todayDate] || [];

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

  const renderDotGrid = () => {
    let dots = [];
    const totalDots = 60; // 5x12 grid for high density look
    
    for (let i = 0; i < totalDots; i++) {
      const isActive = (i * totalTasks * 7) % 100 < 35; 
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

  const size = 120;
  const strokeWidth = 12;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  return (
    <LinearGradient colors={['#131B16', '#050706']} style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.avatarWrapper}>
              <Image source={require('../../assets/logo.png')} style={styles.avatarPlaceholder} />
            </View>
            <View style={styles.headerRight}>
              <View style={styles.notificationBadge}>
                <Ionicons name="notifications-outline" size={22} color={colors.text} />
                <View style={styles.notificationDot} />
              </View>
            </View>
          </View>

          <Text style={styles.greeting}>Good Morning, User</Text>
          <Text style={styles.title}>Your Schedule</Text>

          {/* Date Row */}
          <View style={styles.dateRow}>
            {dynamicDates.map((item, i) => (
              <View key={i} style={[styles.dateBubble, item.isToday && styles.dateBubbleActive]}>
                <Text style={[styles.dateBubbleDay, item.isToday && styles.dateTextActive]}>{item.dayName}</Text>
                <Text style={[styles.dateText, item.isToday && styles.dateTextActive]}>{item.dateNum}</Text>
              </View>
            ))}
          </View>

          {/* Widget Grid */}
          <View style={styles.grid}>
            {/* Left Column */}
            <View style={styles.columnLeft}>
              {/* Activity Card */}
              <View style={styles.widgetCard}>
                <View style={styles.widgetHeader}>
                  <View style={styles.iconBadge}>
                    <Ionicons name="apps" size={16} color={colors.primary} />
                  </View>
                  <Text style={styles.widgetTitle}>Activity</Text>
                </View>
                <Text style={styles.mainStat}>{totalTasks * 3}<Text style={styles.subStat}>/60</Text></Text>
                {renderDotGrid()}
              </View>

              {/* Growth Card */}
              <View style={[styles.widgetCard, { marginTop: 15 }]}>
                <View style={styles.widgetHeader}>
                  <View style={[styles.iconBadge, {backgroundColor: 'rgba(139, 100, 227, 0.1)'}]}>
                    <Ionicons name="trending-up" size={16} color={colors.secondary} />
                  </View>
                  <Text style={styles.widgetTitle}>Growth</Text>
                </View>
                <Text style={styles.mainStat}>{tasks.length === 0 ? 0 : completionRate}%</Text>
                <View style={styles.barChartContainer}>
                   {[30, 50, 40, 80, 60].map((h, i) => (
                     <View key={i} style={styles.barWrapper}>
                       <LinearGradient colors={[colors.secondary, '#583D9E']} style={[styles.bar, {height: `${h}%`}]} />
                     </View>
                   ))}
                </View>
              </View>
            </View>

            {/* Right Column */}
            <View style={styles.columnRight}>
               {/* Today Stats */}
               <View style={styles.widgetCard}>
                 <View style={styles.widgetHeader}>
                   <View style={styles.iconBadge}>
                     <Ionicons name="calendar" size={16} color={colors.primary} />
                   </View>
                   <Text style={styles.widgetTitle}>Today</Text>
                 </View>
                 <Text style={styles.mainStat}>{todaysEvents.length} <Text style={styles.subStat}>Events</Text></Text>
               </View>

               {/* Task Split Card */}
               <View style={[styles.widgetCard, { marginTop: 15, alignItems: 'center' }]}>
                 <View style={[styles.widgetHeader, {alignSelf: 'flex-start', marginBottom: 0}]}>
                   <View style={[styles.iconBadge, {backgroundColor: 'rgba(139, 100, 227, 0.1)'}]}>
                     <Ionicons name="pie-chart" size={16} color={colors.secondary} />
                   </View>
                   <Text style={styles.widgetTitle}>Tasks</Text>
                 </View>
                 <View style={{ marginVertical: 15, position: 'relative' }}>
                   <Svg width={size} height={size}>
                     <G rotation="-90" origin={`${center}, ${center}`}>
                       {/* Background Track */}
                       <Circle stroke="rgba(255,255,255,0.05)" cx={center} cy={center} r={radius} strokeWidth={strokeWidth} fill="transparent" />
                       
                       {/* Glow Effect (thicker, lower opacity) */}
                       <Circle 
                          stroke={colors.secondary} 
                          cx={center} 
                          cy={center} 
                          r={radius} 
                          strokeWidth={strokeWidth + 6} 
                          fill="transparent" 
                          strokeDasharray={circumference} 
                          strokeDashoffset={strokeDashoffset} 
                          strokeLinecap="round" 
                          strokeOpacity={0.2}
                       />
                       
                       {/* Main Ring */}
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
                     <SvgText x={center} y={center} fill={colors.text} fontSize="28" fontWeight="bold" textAnchor="middle" alignmentBaseline="central">
                       {completedTasks}
                     </SvgText>
                   </Svg>
                 </View>
                 
                 <View style={styles.legendContainer}>
                   <View style={styles.legendItem}>
                     <View style={[styles.legendDot, {backgroundColor: colors.secondary}]} />
                     <Text style={styles.legendText}>Done</Text>
                   </View>
                   <View style={styles.legendItem}>
                     <View style={[styles.legendDot, {backgroundColor: 'rgba(255,255,255,0.1)'}]} />
                     <Text style={styles.legendText}>Pending</Text>
                   </View>
                 </View>
               </View>
            </View>
          </View>

          {/* Schedule Preview */}
          <View style={styles.widgetCardFull}>
            <View style={styles.widgetHeader}>
               <View style={styles.iconBadge}>
                 <Ionicons name="time" size={16} color={colors.primary} />
               </View>
               <Text style={styles.widgetTitle}>Upcoming Today</Text>
            </View>
            
            {todaysEvents.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="calendar-clear-outline" size={32} color="rgba(255,255,255,0.2)" />
                <Text style={styles.emptyText}>No events scheduled.</Text>
              </View>
            ) : (
              todaysEvents.map(event => (
                <View key={event.id} style={styles.eventItem}>
                  <View style={styles.eventContent}>
                    <Text style={styles.eventName}>{event.title}</Text>
                    <Text style={styles.eventTime}>{event.time}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                </View>
              ))
            )}
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  avatarWrapper: { backgroundColor: '#FFFFFF', padding: 3, borderRadius: 36, overflow: 'hidden', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 6 },
  avatarPlaceholder: { width: 56, height: 56, resizeMode: 'cover' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  notificationBadge: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  notificationDot: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger || '#FF4C4C' },
  greeting: { color: colors.textSecondary, fontSize: 16, marginBottom: 5, fontWeight: '500' },
  title: { color: colors.text, fontSize: 40, fontWeight: '900', marginBottom: 30, letterSpacing: -1 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  dateBubble: { width: 46, height: 64, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.03)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  dateBubbleActive: { backgroundColor: colors.primary, borderColor: colors.primary, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  dateBubbleDay: { color: colors.textSecondary, fontSize: 11, marginBottom: 4, fontWeight: '600' },
  dateText: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
  dateTextActive: { color: '#000000' },
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  columnLeft: { width: '48%' },
  columnRight: { width: '48%' },
  widgetCard: { backgroundColor: 'rgba(20, 24, 21, 0.6)', borderRadius: 28, padding: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.04)', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 8 },
  widgetCardFull: { backgroundColor: 'rgba(20, 24, 21, 0.6)', borderRadius: 28, padding: 24, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.04)', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 8, marginTop: 5 },
  widgetHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  iconBadge: { width: 32, height: 32, borderRadius: 12, backgroundColor: 'rgba(221, 244, 91, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  widgetTitle: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
  mainStat: { color: colors.text, fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  subStat: { fontSize: 16, color: colors.textSecondary, fontWeight: '500' },
  dotGrid: { flexDirection: 'row', flexWrap: 'wrap', width: '100%', gap: 5, paddingTop: 10 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  barChartContainer: { flexDirection: 'row', justifyContent: 'space-between', height: 70, alignItems: 'flex-end', marginTop: 10 },
  barWrapper: { width: 14, height: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 7, justifyContent: 'flex-end', overflow: 'hidden' },
  bar: { width: '100%', borderRadius: 7 },
  legendContainer: { flexDirection: 'row', justifyContent: 'center', gap: 15, marginTop: 5 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  legendText: { color: colors.textSecondary, fontSize: 11, fontWeight: '500' },
  emptyContainer: { alignItems: 'center', paddingVertical: 20 },
  emptyText: { color: colors.textSecondary, fontStyle: 'italic', marginTop: 10 },
  eventItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', padding: 16, borderRadius: 20, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: colors.primary },
  eventContent: { flex: 1, paddingLeft: 5 },
  eventName: { color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 4 },
  eventTime: { color: colors.textSecondary, fontSize: 13, fontWeight: '500' },
});
