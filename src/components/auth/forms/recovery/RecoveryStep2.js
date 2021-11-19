import React, {useEffect, useState} from "react";
import {apiBase} from "../../../../helpers/Variables";

const RecoveryStep2 = ({email, setStep}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [counter, setCounter] = useState(0);
    const [code, setCode] = useState("");
    // Generates request headers
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    // Resends code
    const resendCode = async (e) => {
        e.preventDefault();
        setIsResending(true)
        // Generates request
        let request = {
            method: 'PUT',
            headers: headers,
        };
        const api = `${apiBase}/user/sendagain/reset?email=${email}`
        try {
            const response = await fetch(api, request);
            if (response.ok) {
                setCounter(60);
                setIsResending(false);
            } else if (response.status >= 400 && response.status < 600) {
                const error = response.json();
                let message = error.message;
                if (message !== undefined) alert(message);
                else alert("An error has occurred. Status code: " + response.status);
                setIsResending(false);
            }
        } catch (error) {
            alert("There was an unexpected error. Error message: " + error);
            setIsResending(false);
        }
    }
    useEffect(() => {
        // Ends counter early when we reach 0
        if (!counter) return;
        // Saves intervalId to clear the interval when the component re-renders
        const intervalId = setInterval(() => {
            setCounter(counter - 1);
        }, 1000);
        // Clears interval on re-render to avoid memory leaks
        return () => clearInterval(intervalId);
    }, [counter]);
    // Handles registration requests
    const verifyRecovery = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Generates request
        let request = {
            method: 'PUT',
            headers: headers,
        };
        // Executes fetch
        const api = `${apiBase}/user/verify/resetpassword?code=${code}`;
        const response = await fetch(api, request)
        if (response.ok) {
            setStep(3);
            setIsLoading(false);
        } else if (response.status >= 400 && response.status < 600) {
            const error = response.json();
            let message = error.message;
            if (message !== undefined) alert(message);
            else alert("An unexpected error has occurred. Status code: " + response.status);
            setIsLoading(false);
        }
    }

    return (
        <div className="auth-section">
            <h1>Reset your password</h1>
            <p>We have sent a code to {email}, please check your email and enter the code below.</p>
            <form className="auth-form" onSubmit={verifyRecovery}>
                <input type="text" placeholder="Verification code"
                       onChange={e => setCode(e.target.value)} required/>
                {!isLoading ? <>
                    <button type="submit" className="button-dark">Proceed</button>
                </> : <>
                    <button disabled>Processing...</button>
                </>}
                {!isResending ? <>
                    {!counter ?
                        <button type="button" className="button-light" onClick={e => resendCode(e)}>Resend code</button>
                        : <button disabled>Sent. You can try again in {counter} seconds.</button>
                    }
                </> : <>
                    <button disabled>Sending...</button>
                </>}
            </form>
        </div>
    )
}
export default RecoveryStep2;