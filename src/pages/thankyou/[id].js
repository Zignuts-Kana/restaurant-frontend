import { Box, Heading, Text } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Success() {
  // console.log(data)
  const [data, setData] = useState(null);
  const router = useRouter();
  const id = router.query.id;

  // const fetchData = async (id) => {
  //   const { data } = await axios.get(
  //     `http://localhost:1337/api/orders/${parseInt(id)}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     }
  //   );
  //   setData(data.data.attributes);
  // };
  useEffect(() => {
    const fetchData = async (id) => {
      const { data } = await axios.get(
        `http://localhost:1337/api/orders/66`,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTAsInJvbGUiOjYsImlhdCI6MTY4MjU3NDMzNCwiZXhwIjoxNjg1MTY2MzM0fQ.PARKPNpJUAYOai3x-HFnKUyAMFbafc3kQW4fsWaDUNg`,
          },
        }
      );
      setData(data.data.attributes);
    };
    // if (id) {
      fetchData(id);
    // }
  }, [id]);
  return (
    <Box textAlign="center" py={10} px={6}>
      <CheckCircleIcon boxSize={"50px"} color={"green.500"} />
      <Heading as="h2" size="xl" mt={6} mb={2}>
        Your order id {id}
      </Heading>
      <Text color={"gray.500"}>
        Details
        {data && JSON.stringify(data)}
      </Text>
    </Box>
  );
}


// export async function getServerSideProps(context) {
//   const id = context.query.id
//   // const token = useLocalStorage()
//   // const token= useLocalStorage("token", []);
//   // console.log('token',token)
//   // Fetch data from external API
//   const { data } = await axios.get(
//     `http://localhost:1337/api/orders/1`,
//     {
//       headers: {
//         Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTAsInJvbGUiOjYsImlhdCI6MTY4MjU3NDMzNCwiZXhwIjoxNjg1MTY2MzM0fQ.PARKPNpJUAYOai3x-HFnKUyAMFbafc3kQW4fsWaDUNg`,
//       },
//     }
//   );

//   // Pass data to the page via props
//   return { props: { data } }
// }
