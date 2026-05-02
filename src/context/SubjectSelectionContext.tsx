"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { subjects } from "@/lib/data";

export type Subject = {
  id: string;
  name: string;
  image: string;
};

export type ExamType = 'waec' | 'jamb' | 'bece' | 'mixed';

export type UserProfile = {
  fullName: string;
  email: string;
  class: string;
  department: string;
  futureArea: string;
  bio: string;
  hobbies: string;
};

type SubjectSelectionContextType = {
  selectedSubjects: string[];
  stacks: Record<ExamType, string[]>;
  toggleSubject: (id: string, examType?: ExamType) => void;
  clearStack: (examType?: ExamType) => void;
  getSelectedSubjectDetails: (examType?: ExamType) => Subject[];
  activeExamType: ExamType;
  setActiveExamType: (type: ExamType) => void;
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
};

const SubjectSelectionContext = createContext<SubjectSelectionContextType | undefined>(undefined);

export function SubjectSelectionProvider({ children }: { children: React.ReactNode }) {
  const [stacks, setStacks] = useState<Record<ExamType, string[]>>({
    waec: [],
    jamb: [],
    bece: [],
    mixed: []
  });
  const [activeExamType, setActiveExamType] = useState<ExamType>('waec');
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "",
    email: "",
    class: "",
    department: "",
    futureArea: "",
    bio: "",
    hobbies: ""
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("handbook_multi_stack");
    const savedProfile = localStorage.getItem("handbook_user_profile");
    
    if (saved) {
      try {
        setStacks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse multi-subject stack", e);
      }
    }
    
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Failed to parse profile", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("handbook_multi_stack", JSON.stringify(stacks));
      localStorage.setItem("handbook_user_profile", JSON.stringify(profile));
    }
  }, [stacks, profile, isInitialized]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const toggleSubject = (id: string, examType: ExamType = activeExamType) => {
    setStacks((prev) => ({
      ...prev,
      [examType]: prev[examType].includes(id) 
        ? prev[examType].filter((s) => s !== id) 
        : [...prev[examType], id]
    }));
  };

  const clearStack = (examType: ExamType = activeExamType) => {
    setStacks(prev => ({
      ...prev,
      [examType]: []
    }));
  };

  const getSelectedSubjectDetails = (examType: ExamType = activeExamType) => {
    // Helper to flatten the new nested structure
    const flattenSubjects = (obj: any): Subject[] => {
      let results: Subject[] = [];
      for (const key in obj) {
        if (Array.isArray(obj[key])) {
          results = results.concat(obj[key]);
        } else if (typeof obj[key] === 'object') {
          results = results.concat(flattenSubjects(obj[key]));
        }
      }
      return results;
    };

    const allSubjects = flattenSubjects(subjects);
    const subjectMap = new Map<string, Subject>();
    allSubjects.forEach(s => {
      subjectMap.set(s.id, s);
    });
    
    // If 'mixed' is requested, gather all IDs from all stacks
    let targetIds: string[] = [];
    if (examType === 'mixed') {
      targetIds = Array.from(new Set(Object.values(stacks).flat()));
    } else {
      targetIds = stacks[examType] || [];
    }

    return Array.from(new Set(targetIds))
      .map(id => subjectMap.get(id))
      .filter((s): s is Subject => s !== undefined);
  };

  return (
    <SubjectSelectionContext.Provider
      value={{ 
        selectedSubjects: stacks[activeExamType] || [], 
        stacks, 
        toggleSubject, 
        clearStack, 
        getSelectedSubjectDetails,
        activeExamType,
        setActiveExamType,
        profile,
        updateProfile
      }}
    >
      {children}
    </SubjectSelectionContext.Provider>
  );
}

export function useSubjectSelection() {
  const context = useContext(SubjectSelectionContext);
  if (context === undefined) {
    throw new Error("useSubjectSelection must be used within a SubjectSelectionProvider");
  }
  return context;
}
