function Tag({tag}) {
  return (
    <button className="">
      <span className="">{tag.icon}{tag.name}</span>
    </button>
  );
}

export default Tag;