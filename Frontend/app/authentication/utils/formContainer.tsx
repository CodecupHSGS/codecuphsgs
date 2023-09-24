export default function FormContainer({children}: {children: React.ReactNode}) { 
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-1/3 h-2/3 rounded-xl box-shadow-sm shadow-md shadow-gray border-gray border-2 p-28">
                {children}
            </div>
        </div>
    )
}