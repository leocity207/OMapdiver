type Constructor<T = {}> = new (...args: any[]) => T;

type InstanceTypeOf<T extends Constructor> = InstanceType<T>;
type StaticTypeOf<T extends Constructor> = Omit<T, "prototype">;

function copyStatics(target: any, source: any) {
	for (const key of [
		...Object.getOwnPropertyNames(source),
		...Object.getOwnPropertySymbols(source),
	]) {
		if (["name", "length", "prototype"].includes(String(key))) continue;

		const desc = Object.getOwnPropertyDescriptor(source, key);
		if (desc) {
			Object.defineProperty(target, key, desc);
		}
	}
}

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type MixedClass<TBase extends Constructor, TMixins extends Constructor[]> = 
	Constructor<InstanceType<TBase> & UnionToIntersection<InstanceTypeOf<TMixins[number]>>> &
	TBase &
	UnionToIntersection<StaticTypeOf<TMixins[number]>>;

function Mix<TMixins extends Constructor[]>(...mixins: TMixins) {
	return function <TBase extends Constructor>(Base: TBase): MixedClass<TBase, TMixins> {

		class Mixed extends Base {
			constructor(...args: any[]) {
				super(...args);

				for (const Mixin of mixins) {
					const instance = new Mixin(...args);
					Object.assign(this, instance);
				}
			}
		}

		// copy prototype + static
		for (const Mixin of mixins) {
			// prototype methods
			Object.getOwnPropertyNames(Mixin.prototype).forEach(name => {
				if (name !== "constructor") {
					Object.defineProperty(
						Mixed.prototype,
						name,
						Object.getOwnPropertyDescriptor(Mixin.prototype, name)!
					);
				}
			});

			// static methods
			copyStatics(Mixed, Mixin);
		}

		return Mixed as MixedClass<TBase, TMixins>;
	};
}

export default Mix;