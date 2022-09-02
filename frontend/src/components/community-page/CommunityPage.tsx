import { EmailIcon } from "@chakra-ui/icons";
import { Avatar, Box, Button, Center, Flex, Heading, IconButton, Text, Tooltip, Link } from "@chakra-ui/react";
import { COLORS } from "../../styles/theme";

interface SocialMediaButton {
  label: string;
  src: string;
  url: string;
}

const SOCIAL_MEDIA_BUTTONS: SocialMediaButton[] = [
  {
    label: "Discord",
    src: "https://www.freepnglogos.com/uploads/discord-logo-png/concours-discord-cartes-voeux-fortnite-france-6.png",
    url: "https://discord.gg/WucSdT8VmS"
  },
  {
    label: "Instagram",
    src: "https://cdn.pixabay.com/photo/2020/11/15/06/18/instagram-logo-5744708_1280.png",
    url: "https://instagram.com/ffxiv_events"
  },
  {
    label: "Twitter",
    src: "https://icon-library.com/images/twitter-transparent-icon/twitter-transparent-icon-15.jpg",
    url: "https://twitter.com/ffxiv_events"
  },
  {
    label: "GitHub",
    src: "https://cdn-icons-png.flaticon.com/512/25/25231.png",
    url: "https://github.com/Recour/ffxiv-events"
  }
];

interface CommunityPageProps {
  navbarHeight: number;
}

const CommunityPage = (communityPageProps: CommunityPageProps) => {
  const { navbarHeight } = communityPageProps;

  return (
    <Center
      height={`calc(100vh - ${navbarHeight}px)`}
      width="100vw"
    >
      <Flex
        p={{
          base: 3,
          sm: 12
        }}
        direction="column"
        alignItems="center"
        height="100%"
        width={{
          base: "90%",
          sm: "80%",
          md: "70%",
          lg: "50%"
        }}
      >
        <Heading
          size="2xl"
          color={COLORS.WHITE}
        >
          Community
        </Heading>

        <Box
          mt={6}
          width="100%"
          backgroundColor={COLORS.WHITE}
          borderRadius="lg"
          overflowY="auto"
          p={{
            base: 6,
            sm: 12
          }}
        >
          <Flex
            direction="row"
            justifyContent="space-evenly"
          >
            {SOCIAL_MEDIA_BUTTONS.map((socialMediaButton, index) =>
              <Tooltip
                shouldWrapChildren
                label={socialMediaButton.label}
                key={index}
              >
                <IconButton
                  variant="outline"
                  colorScheme="gray"
                  borderRadius="50%"
                  height="100%"
                  aria-label={socialMediaButton.label}
                  onClick={() => window.open(socialMediaButton.url)}
                >
                  <Avatar
                    m={3}
                    size={{
                      base: "sm",
                      sm: "lg"
                    }}
                    bg="rgba(255, 255, 255, 0)"
                    src={socialMediaButton.src}
                  />
                </IconButton>
              </Tooltip>
            )}
          </Flex>

          {/* WHAT IS FFXIV EVENTS */}
          <Heading
            mt={{
              base: 3,
              sm: 12
            }}
            size="lg"
          >
            What is FFXIV Events?
          </Heading>

          <Text
            mt={{
              base: 1,
              sm: 3
            }}
            fontSize="lg"
          >
            FFXIV Events is an event hosting web app for Final Fantasy XIV, the popular MMORPG by Squary Enix.<br />
            <br />
            With FFXIV introducing the Data Center Travel System, players can now visit other datacenters.
            FFXIV Events aims to bring the community together by being a global Party Finder.<br />
            <br />
            Looking for people to play with? You can browse through events and filter on your exact needs.<br />
            <br />
            Trying to find guests? Create your own event in just a few minutes. Select the type of event and add several details including a
            livestream that plays live on your event, a video or your website.<br />
            <br />
            New features are making it into FFXIV Events every week.
          </Text>

          {/* PARTNERS */}
          <Heading
            mt={{
              base: 3,
              sm: 12
            }}
            size="lg"
          >
            Partners
          </Heading>

          <Text
            mt={{
              base: 1,
              sm: 3
            }}
            fontSize="lg"
          >
            Do you regularly host events and would you like them to be featured on FFXIV Events?<br />

            <Tooltip
              shouldWrapChildren
              label="Coming Soon"
            >
              <Button
                isDisabled={true}
                mt={{
                  base: 1,
                  sm: 3
                }}
              >
                Apply for partnership (free)
              </Button>
            </Tooltip>
          </Text>

          {/* FEATURE REQUESTS */}
          <Heading
            mt={{
              base: 3,
              sm: 12
            }}
            size="lg"
          >
            "Wouldn't it be nice if..."
          </Heading>

          <Text
            mt={{
              base: 1,
              sm: 3
            }}
            fontSize="lg"
          >
            Does that sound like you at the moment? Great.<br />
            We need suggestions like yours to provide a better experience.<br />
            All feature requests are gladly welcomed.<br />
            Head on over to the Discord server for more info. Thanks for thinking along.
          </Text>

          {/* CONTRIBUTION */}
          <Heading
            mt={{
              base: 3,
              sm: 12
            }}
            size="lg"
          >
            Contribution
          </Heading>

          <Text
            mt={{
              base: 1,
              sm: 3
            }}
            fontSize="lg"
          >
            FFXIV Events is open source.<br />
            Source code can be found on GitHub. Click on the GitHub logo to check it out.<br />
          </Text>

          {/* PRIVACY */}
          <Heading
            mt={{
              base: 3,
              sm: 12
            }}
            size="lg"
          >
            Privacy
          </Heading>

          <Text
            mt={{
              base: 1,
              sm: 3
            }}
            fontSize="lg"
          >
            When you sign in, you are added as a user to the FFXIV Events database.<br />
            Depending on the sign-in method, some of your data is collected. <br />
            For both signing in with Google and Discord: your e-mail, display name, and avatar are stored.
            Only your display name and avatar are visible to other users. None of your data will be shared with third parties. <br />
            <Link href="mailto:someone@yoursite.com" color={COLORS.BLUE_NORMAL}>
              <EmailIcon mr={2} />
              support@ffxiv-events.com
            </Link>
          </Text>
        </Box>
      </Flex>
    </Center>
  );
};

export default CommunityPage;
