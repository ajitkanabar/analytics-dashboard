import { Select } from '@mantine/core';

export default function Dropdown({ selected, options, onchange, label }) {
  return (
    <Select
      label={label}
      value={selected}
      onChange={onchange}
      data={options}
      size="lg"
      radius="xl"
      variant="filled"
      placeholder="Pick value"
      checkIconPosition={null}
      styles={{
        input: {
          backgroundColor: '#1e293b',
          color: 'white',
          border: 'none',
        },
        dropdown: {
          backgroundColor: '#1e293b',
          color: 'white',
        },
      }}
    />
  );
}
