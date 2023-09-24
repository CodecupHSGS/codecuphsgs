"use client"; 
import alertBackendAPIError from '@/app/utils/alertSystem/alertBackendAPIError';
import ContestInfoForm from '../../utils/contestForm';
import { createContest } from '@/backend_api/contests';
import { useRouter } from 'next/navigation';

export default function ContestCreatePage() { 
    const router = useRouter();

    async function onSubmit(contestInfo: Object) { 
        try { 
            await createContest(contestInfo); 
            router.push("/dashboard/contests/upcoming"); 
        }
        catch(e) { 
            alertBackendAPIError(e, "contestCreateSubmitHandler"); 
        }
    }

    return <ContestInfoForm contestInfo = {null} callback={onSubmit}></ContestInfoForm>
}