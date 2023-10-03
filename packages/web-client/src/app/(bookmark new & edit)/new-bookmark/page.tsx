import { Box } from '@web-ui/components/app/atoms/box'
import { BoxHeading } from '@web-ui/components/app/atoms/box-heading'

const Page: React.FC = () => {
  return (
    <>
      <Box>
        <BoxHeading
          heading="Visibility"
          subheading="By publishing bookmark to your profile, you will be able to see who else shared attached links and subscribe to like-minded people."
        />
      </Box>
      <Box>
        <BoxHeading
          heading="Links"
          subheading="Add one or more urls directly related to the bookmarked resource like an article and a place it was shared from."
        />
      </Box>
      <Box>
        <BoxHeading
          heading="Title"
          subheading="Shortly describe this bookmark."
        />
      </Box>
      <Box>
        <BoxHeading
          heading="Tags"
          subheading="Accurate keywords help keeping your library organized."
        />
      </Box>
    </>
  )
}

export default Page
