/** @format */

export const isShortJobCode = (value?: string) => /^\d{8}$/.test(value ?? '');

export const jobCodeFromId = (id: string) => {
    let hash = 2166136261;
    for (const char of id) {
        hash ^= char.charCodeAt(0);
        hash = Math.imul(hash, 16777619);
    }
    return String(hash >>> 0)
        .padStart(10, '0')
        .slice(0, 8);
};

export const findJobByCode = <T extends { id: string }>(jobs: T[], code: string) =>
    jobs.find((job) => jobCodeFromId(job.id) === code);
