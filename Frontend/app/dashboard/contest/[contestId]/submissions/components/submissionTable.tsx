import TimeAndDateHyperLink from "@/app/utils/timeanddate/timeanddate";
import { SubmissionInfo } from "@/backend_api/contests";

export default function SubmissionTable({submissions}: {submissions: SubmissionInfo[]}) { 
    console.log(submissions)
    const tableBody = submissions === undefined || submissions === null || submissions.length === 0? 
        (
            <tr>
                <td colSpan={4} className="text-center p-4">
                    <p className="font-extralight italic">No submission</p>
                </td>
            </tr>
        ): 
        submissions.map((submission, index) => (
            <tr className="p-4" key={index}>
                <td className="p-4">
                    <a href={`/dashboard/submission/${submission.submissionId}`}
                        className="underline">
                            {submission.submissionId}
                    </a>
                </td>
                <td className="p-4">{submission.username}</td>
                <td className="p-4">
                    {
                        new Date(submission.submissionDate)
                        .toLocaleString()
                    }
                </td>
                <td className="p-4"> 
                    {submission.isOfficial? 
                        <p className=" text-green-700"> Official </p>: 
                        <p className="text-red-800"> Unofficial </p>
                    }
                </td>
            </tr>
        )); 
    return (
        <table className="w-full table-fixed font-light border-2 border-gray-900 rounded-lg border-separate">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-4">Submission ID</th>
                    <th className="p-4">Author</th>
                    <th className="p-4">Submission Date</th>
                    <th className="p-4">Official</th>
                </tr>
            </thead>
            <tbody>
                {tableBody}
            </tbody>
        </table>
    )
}