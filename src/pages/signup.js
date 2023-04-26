import useLocalStorage from "@/utils";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { Form } from "react-bootstrap";

export default function SignupCard() {
  const [user, setUser] = useLocalStorage("userInfo", "");
  const toast = useToast();
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  };
  const router = useRouter();
  const handleFormSubmit = async (values) => {
    await axios
      .post(`http://localhost:1337/api/customers`, {
        data: { ...values },
      })
      .then((response) => {
        if (response.status === 200) {
          toast({
            title:
              "OTP sent successfully" + ` ${response.data.data.attributes.otp}`,
            status: "success",
            duration: 1000,
            isClosable: true,
          });
          setUser({
            lastName: response.data.data.attributes.lastName,
            firstName: response.data.data.attributes.firstName,
            email: response.data.data.attributes.email,
            phoneNumber: response.data.data.attributes.phoneNumber,
            otp:response.data.data.attributes.otp,
          });
          router.push("/verifyotp");
        }
      })
      .catch((error) => {
        toast({
          title: `${error.response.data.message}`,
          status: "error",
          duration: 1000,
        });
      });
  };
  const { handleSubmit, handleChange, values } = useFormik({
    initialValues,
    onSubmit: handleFormSubmit,
  });
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <HStack>
                <Box>
                  <FormControl id="firstName" isRequired>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      type="text"
                      onChange={handleChange}
                      value={values.firstName}
                      required
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="lastName">
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      type="text"
                      onChange={handleChange}
                      value={values.lastName}
                    />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  onChange={handleChange}
                  value={values.email}
                  required
                />
              </FormControl>
              <FormControl id="phoneNumber" isRequired>
                <FormLabel>PhoneNumber</FormLabel>
                <Input
                  type="number"
                  onChange={handleChange}
                  value={values.phoneNumber}
                  maxLength={10}
                  minLength={10}
                  required
                />
              </FormControl>
              <Stack spacing={10} alignItems={"center"}>
                <Link
                  href={"/verifyotp"}
                  justifyContent={"center"}
                  width="100%"
                >
                  <Button
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                    type="submit"
                    width="100%"
                  >
                    Get OTP
                  </Button>
                </Link>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Already a user?{" "}
                  <Link color={"blue.400"} href={"/signin"}>
                    Login
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Form>
        </Box>
      </Stack>
    </Flex>
  );
}
