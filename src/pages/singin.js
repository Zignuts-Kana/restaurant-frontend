import useLocalStorage from "@/utils";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { Form } from "react-bootstrap";

export default function SimpleCard() {
  const [user, setUser] = useLocalStorage("userInfo", "");
  const toast = useToast();
  const initialValues = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: "",
    phoneNumber: "",
  };
  const router = useRouter();
  const handleFormSubmit = async (values) => {
    await axios
      .post(`http://localhost:1337/api/customers`, {
        data: { firstName: user.firstName, lastName: user.lastName, ...values },
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
            firstName: user.firstName,
            lastName: user.lastName,
            email: response.data.data.attributes.email,
            phoneNumber: response.data.data.attributes.phoneNumber,
            otp: response.data.data.attributes.otp,
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
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  onChange={handleChange}
                  value={values.email}
                  required
                />
              </FormControl>
              <FormControl id="phoneNumber">
                <FormLabel>PhoneNumber</FormLabel>
                <Input
                  type="number"
                  minLength={10}
                  maxLength={10}
                  onChange={handleChange}
                  value={values.phoneNumber}
                  required
                />
              </FormControl>
              <Stack spacing={10} alignItems={"center"}>
                <Button
                  bg={"blue.400"}
                  color={"white"}
                  type="submit"
                  _hover={{
                    bg: "blue.500",
                  }}
                  width="100%"
                >
                  Get OTP
                </Button>
              </Stack>
            </Stack>
          </Form>
        </Box>
      </Stack>
    </Flex>
  );
}
