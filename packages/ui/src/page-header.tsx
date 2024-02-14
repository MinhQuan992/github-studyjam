interface PageHeaderProps {
  title: string;
}

const PageHeader = ({ title }: PageHeaderProps) => {
  return <h1 className="ui-font-bold ui-text-3xl ui-pb-2">{title}</h1>;
};

export default PageHeader;
