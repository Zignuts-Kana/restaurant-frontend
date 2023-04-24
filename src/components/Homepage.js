import { Button } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect } from "react";

const Homepage = () => {
  useEffect(() => {
    axios
      .get("http://localhost:1337/api/restaurants/1?populate=*")
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  }, []);

  return <div>fetch</div>;
};

export default Homepage;
