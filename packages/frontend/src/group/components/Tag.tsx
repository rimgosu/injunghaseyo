interface TagProps {
  tag: string;
  onClick?: () => void;
}

export const Tag = ({ tag, onClick }: TagProps) => {
  return (
    <button
      key={tag}
      onClick={onClick ?? undefined}
      className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-100"
    >
      {tag}
    </button>
  );
};
