import { Container, Flex, Text } from "@chakra-ui/layout"
import  {Client} from '../../src/pages/clients/ClientForm'
import { Card } from "@chakra-ui/card"
import { Button, ButtonGroup } from "@chakra-ui/button"
import { useRouter } from "next/router"

interface ClientDB extends Client {
    _id: string
}

interface Props {
    clients: ClientDB[]
}

const ClientList = ({clients}: Props) => {

    const router = useRouter()
    
    return (
        <Flex flexDir={"column"} gap={2}>
            {clients.data.data.map(c => (
                <Card key={c._id} p={2} cursor={"pointer"}>
                    <Flex alignItems={"center"} justifyContent={"space-between"}>
                        <Container>
                            <Text as={"b"}>{c.fullname}</Text>
                            <Text as={"p"}>{c.phone}</Text>
                        </Container>
                        <ButtonGroup>
                            <Button color={"green"}>Editar</Button>
                            <Button color={"red"}>Eliminar</Button>
                        </ButtonGroup>
                    </Flex>
                </Card>
            ))}
            <Button colorScheme={"blue"} onClick={()=> {router.back()}}>Volver</Button>
        </Flex>
    )
}

export default ClientList