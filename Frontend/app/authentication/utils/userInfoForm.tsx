import { FormEvent } from "react";

export default function UserInfoForm({
    title, 
    onUsernameChanged, 
    onPasswordChanged, 
    onEmailChanged, 
    onSubmit, 
    action
}: { 
    title: string, 
    onUsernameChanged: (value: string) => void, 
    onPasswordChanged: (value: string) => void, 
    onEmailChanged: (value: string) => void, 
    onSubmit: () => void
    action: string 
}) { 
    function onUsernameInputChanged(event: FormEvent) { 
        const target = event.target as HTMLInputElement; 
        onUsernameChanged(target.value); 
    }
    
    function onPasswordInputChanged(event: FormEvent) { 
        const target = event.target as HTMLInputElement;
        onPasswordChanged(target.value); 
    }

    function onEmailInputChanged(event: FormEvent) { 
        const target = event.target as HTMLInputElement;
        onEmailChanged(target.value); 
    }

    function onSubmitButtonClicked(event: FormEvent) { 
        event.preventDefault();

        onSubmit(); 
    }

    return (
        <div className="w-full h-full flex-col justify-center">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            </div>
            <form className="mt-4">
                <div className="grid grid-cols-1 gap-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-semibold leading-6 text-gray-900">
                            Username
                        </label>
                        <div className="mt-1">
                            <input type="text" name="username" id="username" autoComplete="username" onChange={onUsernameInputChanged}
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6">
                            </input>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                            Email
                        </label>
                        <div className="mt-1">
                            <input type="email" name="email" id="email" autoComplete="email" onChange={onEmailInputChanged}
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6">
                            </input>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-900">
                            Password
                        </label>
                        <div className="mt-1">
                            <input type="password" name="password" id="password" autoComplete="password" onChange={onPasswordInputChanged}
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6">
                            </input>
                        </div>
                    </div>
                    <div className="mt-2.5">
                        <button type="submit" onClick={onSubmitButtonClicked} 
                            className="block w-full rounded-md bg-gray-700 px-3.5 py-2.5 text-center text-sm font-semibold text-white hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
                            {action}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}