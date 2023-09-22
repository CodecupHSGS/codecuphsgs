import Link from "next/link";

export default function TimeAndDateHyperLink({
     date, 
     message
}: { 
     date: Date, 
     message: string
}) { 
     const URIEncodedMessage = encodeURI(message); 
     const dateWithOffset = new Date(date.getTime() - 60000 * date.getTimezoneOffset()); 

     return (
          <Link href={`https://www.timeanddate.com/countdown/generic?iso=${dateWithOffset.toISOString()}&message=${URIEncodedMessage}`}
               target="_blank"
               className=" text-blue-900 underline">
               {date.toLocaleString()}
          </Link>
     )
}