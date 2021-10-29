let holderLoading = { setState: null };

const loading = () => holderLoading.setState(true);
const unLoading = () => holderLoading.setState(false);

export { holderLoading, loading, unLoading };
