export default function Spinner({ size = 32 }) {
  return (
    <div
      className="animate-spin rounded-full border-2 border-vault-muted border-t-transparent"
      style={{ width: size, height: size }}
    />
  );
}
