import { Flex, Text } from '@mantine/core';

export default function AppHeader() {
  return (
    <Flex
      justify="space-between"
      align="center"
      h={50}
      px="lg"
      style={{
        backgroundColor:'rgb(1, 36, 105)',
        borderBottom: '1px solidrgb(19, 2, 110)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        flexShrink: 0,
      }}
    >
      <Text fw={700} size="1.5rem" style={{ color: "white" }}>
        brinersigns
      </Text>
      <Text size="sm" c="dimmed" fw={1000}>
        Analytics
      </Text>
    </Flex>
  );
}
