interface TagProps {
  tag: string;
  onClick?: () => void;
}

export const Tag = ({ tag, onClick }: TagProps) => {
  return (
    <button
      key={tag}
      onClick={onClick ?? undefined}
      disabled={!onClick}
      className={`rounded-full border border-gray-300 px-6 py-2 hover:bg-gray-100 ${
        !onClick && 'cursor-default'
      }`}
    >
      {tag}
    </button>
  );
};
