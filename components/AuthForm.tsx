"use client"
import Image from "next/image"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Link from "next/link"
import { createAccount } from "@/lib/actions/user.action"
import OTPModal from "./OTPModal"

type Formtype = "sign-in" | "sign-up"

const authFormschema = (formType : Formtype) =>{
    return z.object({
        email:z.string().email(),
        fullName : formType === 'sign-up' ? z.string().min(2).max(50) : z.string().optional(),
         
    })
}

const AuthForm = ({type}:{type:Formtype}) => {

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [accountId,setAccountId] = useState('')
    const formSchema = authFormschema(type)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        fullName: "",
        email:""
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        setErrorMessage('')
        try{
            const user = await createAccount({
                fullName : values.fullName || '',
                email : values.email
            });
            setAccountId(user.accountId);

        }catch{
            setErrorMessage("Failed to create an account, Please try again")
        }finally{
            setLoading(false)
        }
    }
  return (
    <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
                <h1 className="form-title">
                    {type === 'sign-in' ? 'sign-in' : 'sign-up' }
                </h1>
                {
                    type === 'sign-up' && (<FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <div className="shad-form-item">
                                <FormLabel className="shad-form-label">Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your full name"  className="shad-input" {...field} />
                                </FormControl>
                            </div>
                            <FormMessage className="shad-form-message"/>
                        </FormItem>
                    )}
                    /> 
                )}

                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <div className="shad-form-item">
                                <FormLabel className="shad-form-label">Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your email"  className="shad-input" {...field} />
                                </FormControl>
                            </div>
                            <FormMessage className="shad-form-message"/>
                        </FormItem>
                    )}
                    />
                
                <Button type="submit" className="form-submit-button" disabled={loading}>
                    {type === 'sign-in' ? 'sign-in' : 'sign-up'}
                    {
                        loading && 
                        (<Image src="/assets/icons/loader.svg" alt="Loader" width={24} height={24} className="ml-2 animate-spin" />)
                    }
                </Button>
                {errorMessage && (<p className="error-message">*{errorMessage}</p>)}
                <div className="body-2 flex justify-center">
                    <p className="text-light-100">
                        {type==='sign-in' ? "Don't have an acount?  " : "Already have an account? "}
                        <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className="text-brand">{type === 'sign-in' ? 'Sign Up' : 'Sign In'}</Link>
                    </p>
                </div>
            </form>
        </Form>
        {accountId && <OTPModal email={form.getValues('email')} accountId={accountId} />}
    </>
    
  )
}

export default AuthForm
