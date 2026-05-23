import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import patientsData from '../data/patients.json';
import therapistsData from '../data/therapists.json';
import evaluationsData from '../data/evaluations.json';
import interventionPlansData from '../data/interventionPlans.json';
import dailyEvolutionsData from '../data/dailyEvolutions.json';
import monthlyFollowupsData from '../data/monthlyFollowups.json';
import schedulesData from '../data/schedules.json';
import paymentsData from '../data/payments.json';

const useStore = create(
  persist(
    (set) => ({
      patients: patientsData,
      therapists: therapistsData,
      evaluations: evaluationsData,
      interventionPlans: interventionPlansData,
      dailyEvolutions: dailyEvolutionsData,
      monthlyFollowups: monthlyFollowupsData,
      schedules: schedulesData,
      payments: paymentsData,

      // Actions
      addPatient: (patient) => set((state) => ({ patients: [...state.patients, patient] })),
      updatePatient: (id, data) => set((state) => ({
        patients: state.patients.map(p => p.id === id ? { ...p, ...data } : p)
      })),
      removePatient: (id) => set((state) => ({ patients: state.patients.filter(p => p.id !== id) })),
      
      updateClinicalHistory: (patientId, data) => set((state) => ({
        patients: state.patients.map(p => 
          p.id === patientId ? { ...p, clinicalHistory: data } : p
        )
      })),
      
      addEvaluation: (evaluation) => set((state) => ({ evaluations: [...state.evaluations, evaluation] })),
      removeEvaluation: (id) => set((state) => ({ evaluations: state.evaluations.filter(e => e.id !== id) })),
      
      addInterventionPlan: (plan) => set((state) => ({ interventionPlans: [...state.interventionPlans, plan] })),
      removeInterventionPlan: (id) => set((state) => ({ interventionPlans: state.interventionPlans.filter(p => p.id !== id) })),

      addDailyEvolution: (evolution) => set((state) => ({ dailyEvolutions: [...state.dailyEvolutions, evolution] })),
      removeDailyEvolution: (id) => set((state) => ({ dailyEvolutions: state.dailyEvolutions.filter(e => e.id !== id) })),
      
      addMonthlyFollowup: (followup) => set((state) => ({ monthlyFollowups: [...state.monthlyFollowups, followup] })),
      removeMonthlyFollowup: (id) => set((state) => ({ monthlyFollowups: state.monthlyFollowups.filter(f => f.id !== id) })),
      
      addSchedule: (schedule) => set((state) => ({ schedules: [...state.schedules, schedule] })),
      updateSchedule: (id, data) => set((state) => ({
        schedules: state.schedules.map(s => s.id === id ? { ...s, ...data } : s)
      })),
      removeSchedule: (id) => set((state) => ({ schedules: state.schedules.filter(s => s.id !== id) })),

      addPayment: (payment) => set((state) => ({ payments: [...state.payments, payment] })),
      removePayment: (id) => set((state) => ({ payments: state.payments.filter(p => p.id !== id) })),
    }),
    {
      name: 'dicere-storage', // unique name for localStorage key
    }
  )
);

export default useStore;
