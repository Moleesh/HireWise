/** @format */

import { useEffect, useMemo, useState } from 'react';
import type { Candidate } from '../../../shared/types';
import { filterCandidates } from '../_private/filter';
import { reportFields } from '../_private/fields';
import { moveItem } from '../_private/reorder';
import {
	readDefaultReportId,
	readSavedReports,
	writeDefaultReportId,
	writeSavedReports,
} from '../_private/storage';
import { buildUniqueReportName } from '../_private/reportNames';
import type { ReportField, SavedReport } from '../_private/types';

const defaultFields = ['name', 'email', 'status', 'experienceYears', 'skills'];

const createReportId = () =>
	globalThis.crypto?.randomUUID?.() ??
	`report-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const useReportBuilder = (candidates: Candidate[]) => {
	const [savedReports, setSavedReports] = useState<SavedReport[]>(readSavedReports);
	const [defaultReportId, setDefaultReportId] = useState(readDefaultReportId);
	const [lastSavedReportId, setLastSavedReportId] = useState('');
	const [reportName, setReportName] = useState('Candidate Report');
	const [search, setSearch] = useState('');
	const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
	const [selectedFieldKeys, setSelectedFieldKeys] = useState<string[]>(defaultFields);
	const [fieldOrder, setFieldOrder] = useState(reportFields.map((field) => field.key));

	const filteredCandidates = useMemo(() => {
		return filterCandidates(candidates, search);
	}, [candidates, search]);

	const selectedCandidates = candidates.filter((candidate) =>
		selectedCandidateIds.includes(candidate.id),
	);
	const orderedFields = fieldOrder
		.map((key) => reportFields.find((field) => field.key === key))
		.filter((field): field is ReportField => Boolean(field));
	const selectedFields = orderedFields.filter((field) => selectedFieldKeys.includes(field.key));
	const reportCandidateIds = selectedCandidateIds.length
		? selectedCandidateIds
		: filteredCandidates.map((candidate) => candidate.id);
	const allFilteredSelected =
		filteredCandidates.length > 0 &&
		filteredCandidates.every((candidate) => selectedCandidateIds.includes(candidate.id));

	const setReports = (reports: SavedReport[]) => {
		setSavedReports(reports);
		writeSavedReports(reports);
	};

	const toggleCandidate = (candidateId: string) => {
		setLastSavedReportId('');
		setSelectedCandidateIds((prev) =>
			prev.includes(candidateId)
				? prev.filter((id) => id !== candidateId)
				: [...prev, candidateId],
		);
	};

	const toggleField = (fieldKey: string) => {
		setLastSavedReportId('');
		setSelectedFieldKeys((prev) =>
			prev.includes(fieldKey) ? prev.filter((key) => key !== fieldKey) : [...prev, fieldKey],
		);
	};

	const reorderField = (fromKey: string, toKey: string) => {
		setLastSavedReportId('');
		setFieldOrder((prev) => moveItem(prev, prev.indexOf(fromKey), prev.indexOf(toKey)));
	};

	const toggleFilteredCandidates = (visibleIds?: string[]) => {
		setLastSavedReportId('');
		const targetCandidates = visibleIds?.length
			? filteredCandidates.filter((candidate) => visibleIds.includes(candidate.id))
			: filteredCandidates;
		if (allFilteredSelected) {
			const filteredIds = new Set(targetCandidates.map((candidate) => candidate.id));
			setSelectedCandidateIds((prev) => prev.filter((id) => !filteredIds.has(id)));
			return;
		}
		setSelectedCandidateIds((prev) =>
			Array.from(new Set([...prev, ...targetCandidates.map((candidate) => candidate.id)])),
		);
	};

	const saveReport = () => {
		if (!reportCandidateIds.length || !selectedFieldKeys.length) return;
		const uniqueName = buildUniqueReportName(
			reportName,
			savedReports.map((report) => report.name),
		);
		const report: SavedReport = {
			id: createReportId(),
			name: uniqueName,
			fieldKeys: selectedFieldKeys,
			candidateIds: reportCandidateIds,
			createdAt: new Date().toISOString(),
		};
		setReports([report, ...savedReports]);
		if (!defaultReportId) setDefaultReport(report.id);
		setLastSavedReportId(report.id);
	};

	const loadReport = (report: SavedReport) => {
		setLastSavedReportId('');
		setReportName(report.name);
		setSelectedFieldKeys(report.fieldKeys);
		setFieldOrder((prev) => Array.from(new Set([...report.fieldKeys, ...prev])));
		setSelectedCandidateIds(report.candidateIds);
	};

	const deleteReport = (reportId: string) => {
		setReports(savedReports.filter((report) => report.id !== reportId));
		if (defaultReportId === reportId) setDefaultReport('');
	};

	const renameReport = (reportId: string, nextName: string) => {
		const trimmed = nextName.trim();
		if (!trimmed) return;
		const baseNames = savedReports
			.filter((report) => report.id !== reportId)
			.map((report) => report.name);
		const uniqueName = buildUniqueReportName(trimmed, baseNames);
		setReports(
			savedReports.map((report) =>
				report.id === reportId ? { ...report, name: uniqueName } : report,
			),
		);
		if (lastSavedReportId === reportId) setReportName(uniqueName);
	};

	const toggleFavoriteReport = (reportId: string) => {
		setReports(
			savedReports.map((report) =>
				report.id === reportId ? { ...report, favorite: !report.favorite } : report,
			),
		);
	};

	const setDefaultReport = (reportId: string) => {
		setDefaultReportId(reportId);
		writeDefaultReportId(reportId);
	};

	const resetReport = () => {
		setLastSavedReportId('');
		setReportName('Candidate Report');
		setSearch('');
		setSelectedCandidateIds([]);
		setSelectedFieldKeys(defaultFields);
		setFieldOrder(reportFields.map((field) => field.key));
	};

	useEffect(() => {
		const defaultReport = savedReports.find((report) => report.id === defaultReportId);
		if (defaultReport) void Promise.resolve().then(() => loadReport(defaultReport));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {
		allFilteredSelected,
		canExport: reportCandidateIds.length > 0 && selectedFields.length > 0,
		deleteReport,
		defaultReportId,
		filteredCandidates,
		orderedFields,
		lastSavedReportId,
		loadReport,
		reportName,
		resetReport,
		renameReport,
		savedReports,
		saveReport,
		search,
		selectedCandidateIds,
		selectedCandidates,
		selectedFieldKeys,
		selectedFields,
		setReportName,
		setSearch,
		setDefaultReport,
		reorderField,
		toggleFavoriteReport,
		toggleCandidate,
		toggleField,
		toggleFilteredCandidates,
	};
};
