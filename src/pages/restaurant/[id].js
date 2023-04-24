import ProductSimple from "@/components/Items";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function Restaurant({setStatus}) {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [restData, setRestData] = useState();
  const fetchData = async () => {
    const { data } = await axios.get(
      `http://localhost:1337/api/categories?populate=*&filters[restaurant]=${router.query.id}`
    );
    setRestData(data);
  };
  const handleImageFetch = async (catId) => {
    setImages([]);
    const { data } = await axios.get(
      `http://localhost:1337/api/menu-items?populate=*&filters[category]=${catId}`
    );
    setImages(data);
  };
  useEffect(() => {
    if (router.query.id) {
      fetchData();
    }
  }, [router.query.id]);

  return (
    <div>
      {/* {restData && JSON.stringify(restData.data,null,2)} */}
      <Accordion>
        {restData &&
          restData.data.map((v) => {
            return (
              <AccordionItem>
                <h2>
                  <AccordionButton onClick={() => handleImageFetch(v.id)}>
                    <Box as="span" flex="1" textAlign="left" textTransform={"uppercase"}>
                      {v.attributes.name}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Flex
                    flexDirection={"row"}
                    flexWrap={"wrap"}
                    justifyContent={"center"}
                    gap={3}
                  >
                    {/* {v.attributes.menu_items.data.map((n) => {
                    return <ProductSimple menuItem={images} images={images} />;
                  })} */}
                    {images.length != 0 ? (
                      images &&
                      <>
                       { images.data.map((n) => {
                        return <ProductSimple setStatus={setStatus} menuItem={n} />
                      })
                    }
                      </>
                    ) : (
                      <>Loading</>
                    )}
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            );
          })}
      </Accordion>
    </div>
  );
}

export default Restaurant;
