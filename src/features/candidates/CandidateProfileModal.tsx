/** @format */

import Modal from '../../shared/components/Modal';
import type { Candidate, CandidateStatus } from '../../shared/types';
import CandidateJobMatches, { type CandidateJobMatch } from './CandidateJobMatches';
import CandidateProfileActions from './CandidateProfileActions';
import CandidateProfileDetails from './CandidateProfileDetails';
import CandidateProfileOverview from './CandidateProfileOverview';

type CandidateProfileModalProps = {
    candidate: Candidate | null;
    candidateJobs: CandidateJobMatch[];
    onClose: () => void;
    onStatusUpdate: (id: string, status: CandidateStatus) => void;
    onDownload: (candidate: Candidate) => void;
};

/** CandidateProfileModal - Candidate detail modal with status and job matches. */
const CandidateProfileModal = ({
    candidate,
    candidateJobs,
    onClose,
    onStatusUpdate,
    onDownload,
}: CandidateProfileModalProps) => {
    if (!candidate) return null;

    return (
        <Modal
            open={!!candidate}
            onClose={onClose}
            title={candidate.name ?? 'Candidate Details'}
            size="lg"
        >
            <div className="space-y-4">
                <CandidateProfileOverview candidate={candidate} />
                <CandidateJobMatches matches={candidateJobs} />
                <CandidateProfileDetails candidate={candidate} />
                <CandidateProfileActions
                    candidate={candidate}
                    onClose={onClose}
                    onStatusUpdate={onStatusUpdate}
                    onDownload={onDownload}
                />
            </div>
        </Modal>
    );
};

export default CandidateProfileModal;
