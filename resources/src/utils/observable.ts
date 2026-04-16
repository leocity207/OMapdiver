import { Subject, filter, Observable as RxObservable } from "rxjs";

type Constructor<T = {}> = new (...args: any[]) => T;

export type ObservableEvent<T = unknown> = {
	name: string;
	data: T;
};

function Observable<TBase extends Constructor<HTMLElement>>(Base: TBase) {
	return class ObservableClass extends Base {

		static subject: Subject<ObservableEvent<any>> = new Subject();

		name: string = "";

		Observable_Init(name: string): void {
			this.name = name;
			this.setAttribute("data-name", this.name);
		}

		Observable_connectedCallback(): void {
			const nameAttr = this.getAttribute("data-name");
			if (nameAttr !== null)
				this.name = nameAttr;
		}

		Emit<T>(data: T): void {
			(this.constructor as typeof ObservableClass).subject.next({
				name: this.name,
				data: data
			});
		}

		static Get_Observable<T = unknown>(name: string): RxObservable<ObservableEvent<T>> {
			return this.subject.pipe(
				filter((event): event is ObservableEvent<T> => event.name === name)
			);
		}
	}
}

export default Observable;