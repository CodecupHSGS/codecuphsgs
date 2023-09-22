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
          <a href={`https://www.timeanddate.com/countdown/generic?iso=${dateWithOffset.toISOString()}&message=${URIEncodedMessage}`}
               className=" text-blue-900 underline">
               {date.toLocaleString()}
          </a>
     )
}