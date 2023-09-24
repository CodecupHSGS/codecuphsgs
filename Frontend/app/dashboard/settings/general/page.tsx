export default function GeneralSettingPage() { 
    return (
        <form className="w-1/2 m-auto mt-10">
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 flex flex-col gap-y-4">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>

                    <div className="sm:col-span-4">
                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-black sm:max-w-md">
                            <input type="text" name="username" id="username" autoComplete="username" className="block flex-1 border-0 bg-transparent p-2 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="janesmith"></input>
                        </div>
                    </div>

                    <div className="w-full">
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-black sm:max-w-md">
                            <input id="email" name="email" type="email" autoComplete="email" className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"></input>
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label className="block text-sm font-medium leading-6 text-gray-900">Full name</label>
                        <div className="mt-2">
                            <input type="text" name="last-name" id="last-name" autoComplete="family-name" className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"></input>
                        </div>
                    </div>
                    <div className="col-span-full">
                        <label className="block text-sm font-medium leading-6 text-gray-900">About</label>
                        <p className="text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p>
                        <textarea id="about" name="about" className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"></textarea>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex items-center justify-center gap-x-6">
                <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
                <button type="submit" className="rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">Save</button>
            </div>
        </form>
    )
}