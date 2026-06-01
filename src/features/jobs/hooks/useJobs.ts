/** @format */

import { useState, useEffect } from 'react';
import { supabase } from '../../../shared/lib/supabase';
import type { Job } from '../../../shared/types';

/** useJobs - Hook for job CRUD operations including create, update, delete, and duplicate */
const useJobs = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    const loadJobs = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('jobs')
            .select('*')
            .order('updatedAt', { ascending: false });
        setJobs((data as Job[]) ?? []);
        setLoading(false);
    };

    useEffect(() => {
        // Defer to avoid triggering react-hooks/set-state-in-effect (ESLint 10+ rule).
        void Promise.resolve().then(loadJobs);
    }, []);

    const createJob = async (job: Partial<Job>) => {
        const { data, error } = await supabase.from('jobs').insert(job).select().single();
        if (!error && data) setJobs((prev) => [data as Job, ...prev]);
        return { data: data as Job | null, error };
    };

    const updateJob = async (id: string, updates: Partial<Job>) => {
        const { data, error } = await supabase
            .from('jobs')
            .update({ ...updates, updatedAt: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (!error && data) {
            setJobs((prev) => prev.map((j) => (j.id === id ? (data as Job) : j)));
        }
        return { data: data as Job | null, error };
    };

    const deleteJob = async (id: string) => {
        const { error } = await supabase.from('jobs').delete().eq('id', id);
        if (!error) setJobs((prev) => prev.filter((j) => j.id !== id));
        return { error };
    };

    const duplicateJob = async (id: string) => {
        const original = jobs.find((j) => j.id === id);
        if (!original) return { data: null, error: 'Job not found' };

        const newJob: Partial<Job> = {
            title: `${original.title} (Copy)`,
            department: original.department,
            location: original.location,
            employmentType: original.employmentType,
            experienceLevel: original.experienceLevel,
            salaryRange: original.salaryRange,
            summary: original.summary,
            responsibilities: original.responsibilities,
            requirements: original.requirements,
            skills: original.skills,
            benefits: original.benefits,
            status: 'draft',
            duplicatedFromId: original.id,
        };

        return createJob(newJob);
    };

    return { jobs, loading, loadJobs, createJob, updateJob, deleteJob, duplicateJob };
};

export { useJobs };
