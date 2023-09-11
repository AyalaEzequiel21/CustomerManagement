import { NextPage } from "next";
import { 
    Container, 
    Heading,
    Card,
    FormControl, FormLabel, FormErrorMessage, Input,
    Button, ButtonGroup
} from '@chakra-ui/react'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import { env } from "~/env.mjs";
import { useRouter } from "next/router";
import { z } from "zod";
import {zodResolver} from '@hookform/resolvers/zod'
import { auto } from "@popperjs/core";


const Login: NextPage = () => {

    const schema = z.object({
        email: z.string().email("Email invalido"),
        password: z.string().length(8, "La contraseña debe contener 8 caracteres")
    })

    type fieldValues = z.infer<typeof schema>

    const {
        register, 
        getValues, 
        handleSubmit, 
        formState:{errors}
    } = useForm<fieldValues>({
        resolver: zodResolver(schema), 
        defaultValues: {email: "beybi@mail.com", password: "daleboca"}
    })
    const router = useRouter()

    const onSubmit = () =>{
        const {email, password} = getValues()
        axios
            .post(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/login`, {email, password}, {withCredentials: true})
            .then(response => router.push("/"))
            .catch(error => console.log(error))
        
    }

    const onError = () => {
        console.log(errors);
    }

    return (
        <Container marginTop={200}>
            <Heading textAlign="center" className="cg">Iniciar sesión</Heading>
            <Card padding={8}>
                <form onSubmit={handleSubmit(onSubmit, onError)}>
                    <FormControl marginBottom={2} isInvalid={!!errors.email}>
                        <FormLabel>Email</FormLabel>
                        <Input 
                            type="text" 
                            placeholder="Ingresa tu email"
                            focusBorderColor='green.500'
                            {...register("email")}
                        />
                        <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.password}>
                        <FormLabel>Contraseña</FormLabel>
                        <Input 
                            type="password" 
                            placeholder="Ingresa tu contraseña"
                            focusBorderColor='green.500'
                            {...register("password")}
                        />
                        <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
                    </FormControl>
                    <ButtonGroup>
                        <Button 
                            width="200px"
                            marginTop={4} 
                            colorScheme='green' 
                            variant='solid'
                            type="submit"
                            mx="auto"
                        >
                            Login
                        </Button>
                    </ButtonGroup>
                </form>
            </Card>
        </Container>
    )
}

export default Login